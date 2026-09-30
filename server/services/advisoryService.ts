import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/connection.js';
import {
  AdvisoryRequestInput,
  AdvisoryResponseData,
  FeedbackInput,
  PaginationQuery,
} from '../../shared/schemas/advisory.js';
import {
  AdvisoryRequestRecord,
  AdvisoryResultRecord,
  AdvisoryFeedbackRecord,
  FullAdvisoryDetail,
  DashboardStats,
} from '../../shared/types/index.js';
import { GeminiService } from './geminiService.js';

export class AdvisoryService {
  static async createAdvisory(
    userId: string,
    input: AdvisoryRequestInput
  ): Promise<FullAdvisoryDetail> {
    const db = await getDb();

    // 1. Generate AI advisory first or concurrently
    console.log(`[AdvisoryService] Generating AI advisory for crop: ${input.cropName}...`);
    const aiOutput = await GeminiService.generateAdvisory(input);

    // 2. Persist Advisory Request
    const requestId = uuidv4();
    const reqInsertSql = `
      INSERT INTO advisory_requests (
        id, user_id, crop_category, crop_name, crop_variety, growth_stage,
        location, state_region, country, cultivated_area,
        soil_type, soil_ph, soil_moisture, organic_matter_status, soil_test_information,
        irrigation_method, irrigation_frequency, water_availability, last_irrigation_at,
        recent_rainfall, temperature, humidity, weather_observations, unusual_weather,
        visible_symptoms, affected_plant_parts, affected_percentage, symptom_duration,
        pest_observations, disease_observations, weed_observations,
        fertilizers_used, pesticides_used, organic_inputs, previous_treatments,
        problem_description, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19,
        $20, $21, $22, $23, $24,
        $25, $26, $27, $28,
        $29, $30, $31,
        $32, $33, $34, $35,
        $36, NOW()
      ) RETURNING *;
    `;

    let lastIrrigationDate: Date | null = null;
    if (input.lastIrrigationAt) {
      const parsed = new Date(input.lastIrrigationAt);
      if (!isNaN(parsed.getTime())) {
        lastIrrigationDate = parsed;
      }
    }

    const reqValues = [
      requestId,
      userId,
      input.cropCategory || null,
      input.cropName.trim(),
      input.cropVariety?.trim() || null,
      input.growthStage,
      input.location.trim(),
      input.stateRegion?.trim() || null,
      input.country?.trim() || null,
      input.cultivatedArea ?? null,
      input.soilType,
      input.soilPh ?? null,
      input.soilMoisture?.trim() || null,
      input.organicMatterStatus?.trim() || null,
      input.soilTestInformation?.trim() || null,
      input.irrigationMethod,
      input.irrigationFrequency?.trim() || null,
      input.waterAvailability?.trim() || null,
      lastIrrigationDate,
      input.recentRainfall?.trim() || null,
      input.temperature?.trim() || null,
      input.humidity?.trim() || null,
      input.weatherObservations?.trim() || null,
      input.unusualWeather?.trim() || null,
      input.visibleSymptoms?.trim() || null,
      input.affectedPlantParts?.trim() || null,
      input.affectedPercentage ?? null,
      input.symptomDuration?.trim() || null,
      input.pestObservations?.trim() || null,
      input.diseaseObservations?.trim() || null,
      input.weedObservations?.trim() || null,
      input.fertilizersUsed?.trim() || null,
      input.pesticidesUsed?.trim() || null,
      input.organicInputs?.trim() || null,
      input.previousTreatments?.trim() || null,
      input.problemDescription.trim(),
    ];

    const reqResult = await db.query<AdvisoryRequestRecord>(reqInsertSql, reqValues);
    const savedRequest = reqResult.rows[0];

    // 3. Persist Advisory Result
    const resultId = uuidv4();
    const resInsertSql = `
      INSERT INTO advisory_results (
        id, advisory_request_id, category, secondary_categories,
        situation_summary, crop_assessment, possible_causes, immediate_actions,
        irrigation_recommendations, soil_recommendations, pest_disease_considerations,
        preventive_measures, monitoring_checklist, severity, confidence,
        warnings, expert_escalation, additional_information_needed,
        ai_model, ai_raw_response, created_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18,
        $19, $20, NOW()
      ) RETURNING *;
    `;

    const resValues = [
      resultId,
      requestId,
      aiOutput.data.category,
      JSON.stringify(aiOutput.data.secondary_categories || []),
      aiOutput.data.situation_summary,
      aiOutput.data.crop_assessment,
      JSON.stringify(aiOutput.data.possible_causes || []),
      JSON.stringify(aiOutput.data.immediate_actions || []),
      JSON.stringify(aiOutput.data.irrigation_recommendations || []),
      JSON.stringify(aiOutput.data.soil_recommendations || []),
      JSON.stringify(aiOutput.data.pest_disease_considerations || []),
      JSON.stringify(aiOutput.data.preventive_measures || []),
      JSON.stringify(aiOutput.data.monitoring_checklist || []),
      aiOutput.data.severity,
      aiOutput.data.confidence,
      JSON.stringify(aiOutput.data.warnings || []),
      aiOutput.data.expert_escalation,
      JSON.stringify(aiOutput.data.additional_information_needed || []),
      aiOutput.model,
      JSON.stringify(aiOutput.rawResponse || {}),
    ];

    const resResult = await db.query<any>(resInsertSql, resValues);
    const savedResultRaw = resResult.rows[0];
    const savedResult = this.normalizeResultRecord(savedResultRaw);

    console.log(`[AdvisoryService] Advisory created successfully. ID: ${requestId}`);
    return {
      request: savedRequest,
      result: savedResult,
      feedback: null,
    };
  }

  static async getAdvisoriesByUser(
    userId: string,
    query: PaginationQuery
  ): Promise<{ advisories: any[]; total: number; page: number; limit: number }> {
    const db = await getDb();
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE req.user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (query.severity) {
      whereClause += ` AND res.severity = $${paramIndex}`;
      params.push(query.severity);
      paramIndex++;
    }

    if (query.crop) {
      whereClause += ` AND req.crop_name ILIKE $${paramIndex}`;
      params.push(`%${query.crop.trim()}%`);
      paramIndex++;
    }

    if (query.search) {
      whereClause += ` AND (req.crop_name ILIKE $${paramIndex} OR req.location ILIKE $${paramIndex} OR res.category ILIKE $${paramIndex} OR req.problem_description ILIKE $${paramIndex})`;
      params.push(`%${query.search.trim()}%`);
      paramIndex++;
    }

    // Count query
    const countSql = `
      SELECT COUNT(*) as count
      FROM advisory_requests req
      JOIN advisory_results res ON res.advisory_request_id = req.id
      ${whereClause};
    `;
    const countResult = await db.query<{ count: string | number }>(countSql, params);
    const total = Number(countResult.rows[0]?.count || 0);

    // List query
    const listSql = `
      SELECT 
        req.id,
        req.crop_name,
        req.growth_stage,
        req.location,
        req.problem_description,
        req.created_at,
        res.id as result_id,
        res.category,
        res.severity,
        res.confidence,
        res.situation_summary
      FROM advisory_requests req
      JOIN advisory_results res ON res.advisory_request_id = req.id
      ${whereClause}
      ORDER BY req.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    params.push(limit, offset);

    const listResult = await db.query<any>(listSql, params);

    return {
      advisories: listResult.rows.map((row) => ({
        id: row.id,
        cropName: row.crop_name,
        growthStage: row.growth_stage,
        location: row.location,
        problemDescription: row.problem_description,
        createdAt: row.created_at,
        resultId: row.result_id,
        category: row.category,
        severity: row.severity,
        confidence: row.confidence,
        situationSummary: row.situation_summary,
      })),
      total,
      page,
      limit,
    };
  }

  static async getAdvisoryById(
    advisoryId: string,
    userId: string
  ): Promise<FullAdvisoryDetail | null> {
    const db = await getDb();

    // Enforce data isolation: verify user_id = $2
    const reqSql = `
      SELECT * FROM advisory_requests
      WHERE id = $1 AND user_id = $2
      LIMIT 1;
    `;
    const reqResult = await db.query<AdvisoryRequestRecord>(reqSql, [advisoryId, userId]);

    if (reqResult.rows.length === 0) {
      return null;
    }

    const requestRecord = reqResult.rows[0];

    // Fetch result
    const resSql = `
      SELECT * FROM advisory_results
      WHERE advisory_request_id = $1
      LIMIT 1;
    `;
    const resResult = await db.query<any>(resSql, [advisoryId]);
    if (resResult.rows.length === 0) {
      return null;
    }

    const resultRecord = this.normalizeResultRecord(resResult.rows[0]);

    // Fetch feedback if any
    const fbSql = `
      SELECT * FROM advisory_feedback
      WHERE advisory_result_id = $1 AND user_id = $2
      LIMIT 1;
    `;
    const fbResult = await db.query<AdvisoryFeedbackRecord>(fbSql, [resultRecord.id, userId]);
    const feedback = fbResult.rows.length > 0 ? fbResult.rows[0] : null;

    return {
      request: requestRecord,
      result: resultRecord,
      feedback,
    };
  }

  static async deleteAdvisory(advisoryId: string, userId: string): Promise<boolean> {
    const db = await getDb();

    // Verify ownership
    const checkSql = 'SELECT id FROM advisory_requests WHERE id = $1 AND user_id = $2 LIMIT 1;';
    const checkResult = await db.query(checkSql, [advisoryId, userId]);

    if (checkResult.rows.length === 0) {
      return false;
    }

    // Delete cascading
    await db.query('DELETE FROM advisory_requests WHERE id = $1;', [advisoryId]);
    return true;
  }

  static async submitFeedback(
    advisoryResultId: string,
    userId: string,
    feedback: FeedbackInput
  ): Promise<AdvisoryFeedbackRecord> {
    const db = await getDb();

    // Verify user owns the advisory result
    const verifySql = `
      SELECT res.id 
      FROM advisory_results res
      JOIN advisory_requests req ON req.id = res.advisory_request_id
      WHERE res.id = $1 AND req.user_id = $2
      LIMIT 1;
    `;
    const verifyResult = await db.query(verifySql, [advisoryResultId, userId]);
    if (verifyResult.rows.length === 0) {
      const err: any = new Error('Advisory not found or unauthorized.');
      err.statusCode = 404;
      throw err;
    }

    // Check if feedback already exists for this result
    const existingSql = `
      SELECT id FROM advisory_feedback 
      WHERE advisory_result_id = $1 AND user_id = $2 
      LIMIT 1;
    `;
    const existing = await db.query(existingSql, [advisoryResultId, userId]);

    if (existing.rows.length > 0) {
      const updateSql = `
        UPDATE advisory_feedback
        SET rating = $1, feedback = $2, created_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      const updateRes = await db.query<AdvisoryFeedbackRecord>(updateSql, [
        feedback.rating,
        feedback.feedback || null,
        existing.rows[0].id,
      ]);
      return updateRes.rows[0];
    } else {
      const insertSql = `
        INSERT INTO advisory_feedback (id, advisory_result_id, user_id, rating, feedback, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
      `;
      const insertRes = await db.query<AdvisoryFeedbackRecord>(insertSql, [
        uuidv4(),
        advisoryResultId,
        userId,
        feedback.rating,
        feedback.feedback || null,
      ]);
      return insertRes.rows[0];
    }
  }

  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const db = await getDb();

    // Total count
    const totalSql = 'SELECT COUNT(*) as count FROM advisory_requests WHERE user_id = $1;';
    const totalRes = await db.query<{ count: string | number }>(totalSql, [userId]);
    const totalAdvisories = Number(totalRes.rows[0]?.count || 0);

    // Crops analyzed count
    const cropsSql = 'SELECT COUNT(DISTINCT LOWER(crop_name)) as count FROM advisory_requests WHERE user_id = $1;';
    const cropsRes = await db.query<{ count: string | number }>(cropsSql, [userId]);
    const cropsAnalyzed = Number(cropsRes.rows[0]?.count || 0);

    // High risk count
    const highRiskSql = `
      SELECT COUNT(*) as count 
      FROM advisory_requests req
      JOIN advisory_results res ON res.advisory_request_id = req.id
      WHERE req.user_id = $1 AND res.severity IN ('HIGH', 'CRITICAL');
    `;
    const highRiskRes = await db.query<{ count: string | number }>(highRiskSql, [userId]);
    const highRiskCount = Number(highRiskRes.rows[0]?.count || 0);

    // Recent 5 advisories
    const recentSql = `
      SELECT 
        req.id,
        req.crop_name,
        req.growth_stage,
        req.location,
        req.created_at,
        res.severity,
        res.category,
        res.situation_summary
      FROM advisory_requests req
      JOIN advisory_results res ON res.advisory_request_id = req.id
      WHERE req.user_id = $1
      ORDER BY req.created_at DESC
      LIMIT 5;
    `;
    const recentRes = await db.query<any>(recentSql, [userId]);

    return {
      totalAdvisories,
      cropsAnalyzed,
      highRiskCount,
      recentAdvisories: recentRes.rows.map((r) => ({
        id: r.id,
        cropName: r.crop_name,
        growthStage: r.growth_stage,
        location: r.location,
        severity: r.severity,
        category: r.category,
        createdAt: r.created_at,
        situationSummary: r.situation_summary,
      })),
    };
  }

  private static normalizeResultRecord(row: any): AdvisoryResultRecord {
    const parseField = (val: any, fallback: any = []) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return val || fallback;
    };

    return {
      id: row.id,
      advisory_request_id: row.advisory_request_id,
      category: row.category,
      secondary_categories: parseField(row.secondary_categories, []),
      situation_summary: row.situation_summary,
      crop_assessment: row.crop_assessment,
      possible_causes: parseField(row.possible_causes, []),
      immediate_actions: parseField(row.immediate_actions, []),
      irrigation_recommendations: parseField(row.irrigation_recommendations, []),
      soil_recommendations: parseField(row.soil_recommendations, []),
      pest_disease_considerations: parseField(row.pest_disease_considerations, []),
      preventive_measures: parseField(row.preventive_measures, []),
      monitoring_checklist: parseField(row.monitoring_checklist, []),
      severity: row.severity,
      confidence: row.confidence,
      warnings: parseField(row.warnings, []),
      expert_escalation: row.expert_escalation,
      additional_information_needed: parseField(row.additional_information_needed, []),
      ai_model: row.ai_model,
      ai_raw_response: parseField(row.ai_raw_response, {}),
      created_at: row.created_at,
    };
  }
}
