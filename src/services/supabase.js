import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('FarmFlux: Supabase env vars not set. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

/* ─── Auth Helpers ─── */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

export async function ensureUserInDB(user) {
    const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

    if (!existing) {
        const { error } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url || '',
            created_at: new Date().toISOString(),
        });
        if (error && error.code !== '23505') console.error('Error creating user:', error);
    }
}

/* ─── Disease Analyses CRUD ─── */
export async function saveDiseaseAnalysis(data) {
    try {
        const { data: result, error } = await supabase.from('disease_analyses').insert(data).select().single();
        if (error) { console.error('saveDiseaseAnalysis error:', error.message); return null; }
        return result;
    } catch (err) { console.error('saveDiseaseAnalysis:', err); return null; }
}

export async function getDiseaseAnalyses(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('disease_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('getDiseaseAnalyses error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getDiseaseAnalyses:', err); return []; }
}

/* ─── Soil Analyses CRUD ─── */
export async function saveSoilAnalysis(data) {
    try {
        const { data: result, error } = await supabase.from('soil_analyses').insert(data).select().single();
        if (error) { console.error('saveSoilAnalysis error:', error.message); return null; }
        return result;
    } catch (err) { console.error('saveSoilAnalysis:', err); return null; }
}

export async function getSoilAnalyses(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('soil_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('getSoilAnalyses error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getSoilAnalyses:', err); return []; }
}

/* ─── Yield Predictions CRUD ─── */
export async function saveYieldPrediction(data) {
    try {
        const { data: result, error } = await supabase.from('yield_predictions').insert(data).select().single();
        if (error) { console.error('saveYieldPrediction error:', error.message); return null; }
        return result;
    } catch (err) { console.error('saveYieldPrediction:', err); return null; }
}

export async function getYieldPredictions(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('yield_predictions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('getYieldPredictions error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getYieldPredictions:', err); return []; }
}

/* ─── Marketplace CRUD ─── */
export async function createListing(data) {
    try {
        const { data: result, error } = await supabase.from('marketplace').insert(data).select().single();
        if (error) { console.error('createListing error:', error.message); throw error; }
        return result;
    } catch (err) { console.error('createListing:', err); throw err; }
}

export async function getListings(filters = {}) {
    try {
        let query = supabase.from('marketplace').select('*').order('created_at', { ascending: false });
        if (filters.crop_type) query = query.eq('crop_name', filters.crop_type);
        if (filters.location) query = query.ilike('location', `%${filters.location}%`);
        if (filters.min_price) query = query.gte('price', filters.min_price);
        if (filters.max_price) query = query.lte('price', filters.max_price);
        const { data, error } = await query;
        if (error) { console.error('getListings error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getListings:', err); return []; }
}

export async function getMyListings(userId) {
    try {
        const { data, error } = await supabase
            .from('marketplace')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) { console.error('getMyListings error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getMyListings:', err); return []; }
}

export async function deleteListing(id) {
    try {
        const { error } = await supabase.from('marketplace').delete().eq('id', id);
        if (error) { console.error('deleteListing error:', error.message); throw error; }
    } catch (err) { console.error('deleteListing:', err); throw err; }
}

/* ─── Disease Alerts CRUD ─── */
export async function createDiseaseAlert(data) {
    try {
        const { data: result, error } = await supabase.from('disease_alerts').insert(data).select().single();
        if (error) { console.error('createDiseaseAlert error:', error.message); throw error; }
        return result;
    } catch (err) { console.error('createDiseaseAlert:', err); throw err; }
}

export async function getDiseaseAlerts(filters = {}) {
    try {
        let query = supabase.from('disease_alerts').select('*').order('created_at', { ascending: false });
        if (filters.disease_type) query = query.eq('disease_name', filters.disease_type);
        if (filters.severity) query = query.eq('severity', filters.severity);
        const { data, error } = await query;
        if (error) { console.error('getDiseaseAlerts error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getDiseaseAlerts:', err); return []; }
}

/* ─── Irrigation Logs CRUD ─── */
export async function saveIrrigationLog(data) {
    try {
        const { data: result, error } = await supabase.from('irrigation_logs').insert(data).select().single();
        if (error) { console.error('saveIrrigationLog error:', error.message); return null; }
        return result;
    } catch (err) { console.error('saveIrrigationLog:', err); return null; }
}

export async function getIrrigationLogs(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('irrigation_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) { console.error('getIrrigationLogs error:', error.message); return []; }
        return data || [];
    } catch (err) { console.error('getIrrigationLogs:', err); return []; }
}

/* ─── Urban Farming CRUD ─── */
export async function saveUrbanFarmingSession(data) {
    try {
        const { data: result, error } = await supabase.from('urban_farming').insert(data).select().single();
        if (error) { console.error('saveUrbanFarmingSession error:', error.message); return null; }
        return result;
    } catch (err) { console.error('saveUrbanFarmingSession:', err); return null; }
}

/* ─── Image Upload ─── */
export async function uploadCropImage(userId, file) {
    const timestamp = Date.now();
    const path = `${userId}/${timestamp}_${file.name}`;
    const { data, error } = await supabase.storage
        .from('crop-images')
        .upload(path, file, { contentType: file.type });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('crop-images').getPublicUrl(data.path);
    return urlData.publicUrl;
}

/* ─── User Stats ─── */
export async function getUserStats(userId) {
    try {
        const [diseases, soils, yields, irrigations] = await Promise.all([
            supabase.from('disease_analyses').select('id', { count: 'exact' }).eq('user_id', userId),
            supabase.from('soil_analyses').select('id', { count: 'exact' }).eq('user_id', userId),
            supabase.from('yield_predictions').select('id', { count: 'exact' }).eq('user_id', userId),
            supabase.from('irrigation_logs').select('id', { count: 'exact' }).eq('user_id', userId),
        ]);
        return {
            totalAnalyses: (diseases.count || 0) + (soils.count || 0),
            diseasesDetected: diseases.count || 0,
            cropsMonitored: yields.count || 0,
            waterSaved: (irrigations.count || 0) * 150,
        };
    } catch (err) {
        console.error('getUserStats:', err);
        return { totalAnalyses: 0, diseasesDetected: 0, cropsMonitored: 0, waterSaved: 0 };
    }
}

/* ─── Recent Analyses ─── */
export async function getRecentAnalyses(userId, limit = 5) {
    try {
        const [diseaseRes, soilRes] = await Promise.all([
            supabase.from('disease_analyses').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit),
            supabase.from('soil_analyses').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit),
        ]);
        const all = [
            ...(diseaseRes.data || []).map(d => ({ ...d, type: 'disease' })),
            ...(soilRes.data || []).map(s => ({ ...s, type: 'soil' })),
        ];
        all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return all.slice(0, limit);
    } catch (err) {
        console.error('getRecentAnalyses:', err);
        return [];
    }
}
