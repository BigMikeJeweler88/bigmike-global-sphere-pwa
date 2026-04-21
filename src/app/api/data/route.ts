import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ekmkwskitcxhkmebyuih.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbWt3c2tpdGN4aGttZWJ5dWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAwMzg5MywiZXhwIjoyMDg0NTc5ODkzfQ.egHJA3mdrlM90quDvkKQfLfKKgPo00l1pqV4QCaO1EQ'

const sb = createClient(SUPABASE_URL, SERVICE_KEY)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  // DEBUG endpoint - see raw Supabase state
  if (type === 'debug') {
    try {
      // Try raw count with no filters
      const { count: rawCount, error: rawErr } = await sb
        .from('clients').select('*', { count: 'exact', head: true })
      
      // Get distinct client_type values
      const { data: types, error: typesErr } = await sb
        .from('clients').select('client_type').limit(200)
      
      const typeCounts: Record<string, number> = {}
      for (const row of (types ?? [])) {
        const t = row.client_type || 'NULL'
        typeCounts[t] = (typeCounts[t] || 0) + 1
      }

      // Get 3 raw rows
      const { data: sample, error: sampleErr } = await sb
        .from('clients').select('id,name,client_type,league').limit(3)

      // Check proactive_alerts
      const { count: alertCount, error: alertErr } = await sb
        .from('proactive_alerts').select('*', { count: 'exact', head: true })

      return NextResponse.json({
        url: SUPABASE_URL,
        rawCount,
        rawError: rawErr?.message,
        distinctClientTypes: typeCounts,
        sample,
        sampleError: sampleErr?.message,
        alertCount,
        alertError: alertErr?.message,
      })
    } catch (e: any) {
      return NextResponse.json({ fatalError: e.message })
    }
  }

  try {
    switch (type) {

      case 'dashboard': {
        const [total, athletes, music, civilians, alerts, report, live] = await Promise.all([
          sb.from('clients').select('*', { count: 'exact', head: true }),
          sb.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'athlete'),
          sb.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'music_artist'),
          sb.from('clients').select('*', { count: 'exact', head: true }).eq('client_type', 'civilian'),
          sb.from('proactive_alerts').select('id,alert_priority,alert_title,alert_type,client_name,created_at').order('created_at', { ascending: false }).limit(50),
          sb.from('daily_reports').select('id,report_date,summary,report_type,sent_at').order('created_at', { ascending: false }).limit(1),
          sb.from('exceptional_stats').select('id,stat_type,stat_value,game_date,client_id,clients(name,team,league)').order('game_date', { ascending: false }).limit(15),
        ])
        const influencers = (total.count ?? 0) - (athletes.count ?? 0) - (music.count ?? 0) - (civilians.count ?? 0)
        return NextResponse.json({
          total: total.count ?? 0,
          athletes: athletes.count ?? 0,
          music: music.count ?? 0,
          civilians: civilians.count ?? 0,
          influencers: Math.max(0, influencers),
          alerts: alerts.data ?? [],
          report: report.data?.[0] ?? null,
          liveStats: live.data ?? [],
        })
      }

      case 'athletes': {
        const search = searchParams.get('search') || ''
        const league = searchParams.get('league') || ''
        let q = sb.from('clients')
          .select('id,name,position,team,league,salary_annual,contract_value,remaining_contract_years,headshot_url,instagram,birthday,espn_id,behavioral_archetype', { count: 'exact' })
          .eq('client_type', 'athlete').order('name').limit(500)
        if (search) q = q.ilike('name', `%${search}%`)
        if (league) q = q.eq('league', league)
        const { data, count } = await q
        const [bonuses, fa] = await Promise.all([
          sb.from('contract_bonuses').select('id,client_name,bonus_category,bonus_amount,progress_percentage,status,league').order('created_at', { ascending: false }).limit(100),
          sb.from('free_agency_status').select('id,client_id,status,eligible_date,market_value_estimate,season,clients(name,team,league,position)').order('eligible_date').limit(50),
        ])
        return NextResponse.json({ data: data ?? [], total: count ?? 0, bonuses: bonuses.data ?? [], freeAgency: fa.data ?? [] })
      }

      case 'athlete': {
        const id = searchParams.get('id')
        if (!id) return NextResponse.json(null)
        const { data } = await sb.from('clients').select('*').eq('id', id).single()
        return NextResponse.json(data ?? null)
      }

      case 'music': {
        const search = searchParams.get('search') || ''
        let q = sb.from('clients')
          .select('id,name,genre,instagram,instagram_followers,instagram_bio,headshot_url,notes,behavioral_archetype,propensity_jewelry,propensity_timepieces', { count: 'exact' })
          .eq('client_type', 'music_artist').order('name').limit(500)
        if (search) q = q.ilike('name', `%${search}%`)
        const { data, count } = await q
        return NextResponse.json({ data: data ?? [], total: count ?? 0 })
      }

      case 'civilians': {
        const search = searchParams.get('search') || ''
        let q = sb.from('clients')
          .select('id,name,instagram,instagram_followers,instagram_bio,behavioral_archetype,propensity_jewelry,propensity_timepieces,propensity_automobiles,notes,hometown,birthday', { count: 'exact' })
          .eq('client_type', 'civilian').order('name').limit(500)
        if (search) q = q.ilike('name', `%${search}%`)
        const { data, count } = await q
        return NextResponse.json({ data: data ?? [], total: count ?? 0 })
      }

      case 'influencers': {
        const search = searchParams.get('search') || ''
        let q = sb.from('clients')
          .select('id,name,instagram,instagram_followers,instagram_bio,behavioral_archetype,notes,hometown,client_type', { count: 'exact' })
          .not('client_type', 'in', '("athlete","music_artist","civilian")')
          .order('instagram_followers', { ascending: false, nullsFirst: false }).limit(500)
        if (search) q = q.ilike('name', `%${search}%`)
        const { data, count } = await q
        return NextResponse.json({ data: data ?? [], total: count ?? 0 })
      }

      case 'sales': {
        const [txns, all] = await Promise.all([
          sb.from('sales_transactions').select('id,client_name,category,item_description,amount,commission_amount,transaction_date,notes').order('transaction_date', { ascending: false }).limit(200),
          sb.from('sales_transactions').select('amount,category').limit(2000),
        ])
        const total = (all.data ?? []).reduce((s, r) => s + (r.amount || 0), 0)
        const by_cat: Record<string, number> = {}
        for (const r of (all.data ?? [])) { by_cat[r.category || 'Other'] = (by_cat[r.category || 'Other'] || 0) + (r.amount || 0) }
        return NextResponse.json({
          transactions: txns.data ?? [],
          total_revenue: total,
          total_transactions: all.data?.length ?? 0,
          by_category: Object.entries(by_cat).map(([k, v]) => ({ category: k, total: v })).sort((a, b) => b.total - a.total),
        })
      }

      case 'system': {
        const [health, inferences, facts, report] = await Promise.all([
          sb.from('system_health_log').select('id,component,status,latency_ms,error_message,checked_at').order('checked_at', { ascending: false }).limit(30),
          sb.from('inference_records').select('id,inference_type,subject,confidence_score,review_status,created_at').order('created_at', { ascending: false }).limit(20),
          sb.from('fact_records').select('id,fact_type,source,content,confidence,created_at').order('created_at', { ascending: false }).limit(20),
          sb.from('daily_reports').select('id,report_date,summary,content,report_type,sent_at').order('created_at', { ascending: false }).limit(1),
        ])
        return NextResponse.json({ health: health.data ?? [], inferences: inferences.data ?? [], facts: facts.data ?? [], report: report.data?.[0] ?? null })
      }

      case 'alerts': {
        const { data } = await sb.from('proactive_alerts')
          .select('id,client_id,client_name,league,alert_type,alert_priority,alert_title,alert_message,action_recommended,is_read,created_at')
          .order('created_at', { ascending: false }).limit(200)
        return NextResponse.json(data ?? [])
      }

      case 'birthdays': {
        const { data } = await sb.from('clients')
          .select('id,name,birthday,league,team,client_type,headshot_url').not('birthday', 'is', null).limit(2000)
        if (!data?.length) return NextResponse.json([])
        const today = new Date()
        const results = data.map(c => {
          const bd = new Date(c.birthday as string)
          const next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate())
          if (next < today) next.setFullYear(today.getFullYear() + 1)
          const days_until = Math.round((next.getTime() - today.getTime()) / 86_400_000)
          const age = today.getFullYear() - bd.getFullYear() + (next.getFullYear() > today.getFullYear() ? 0 : 1)
          return { ...c, days_until, age }
        }).filter(c => c.days_until <= 30).sort((a, b) => a.days_until - b.days_until)
        return NextResponse.json(results)
      }

      case 'highlights': {
        const { data } = await sb.from('contract_signings')
          .select('id,client_id,client_name,team,league,contract_value,contract_years,annual_value,signing_bonus,guaranteed_money,signing_date')
          .order('signing_date', { ascending: false }).limit(100)
        return NextResponse.json(data ?? [])
      }

      case 'outreach': {
        const [queue, pending, approved, total] = await Promise.all([
          sb.from('approval_queue').select('id,client_id,client_name,message_text,persona,status,created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(100),
          sb.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          sb.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
          sb.from('approval_queue').select('*', { count: 'exact', head: true }),
        ])
        return NextResponse.json({ queue: queue.data ?? [], pending: pending.count ?? 0, approved: approved.count ?? 0, total: total.count ?? 0 })
      }

      case 'search': {
        const q = searchParams.get('q') || ''
        if (q.length < 2) return NextResponse.json([])
        const { data } = await sb.from('clients')
          .select('id,name,client_type,league,team,position,headshot_url,instagram')
          .ilike('name', `%${q}%`).limit(40)
        return NextResponse.json(data ?? [])
      }

      default:
        return NextResponse.json({ error: 'Unknown type: ' + type }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack?.slice(0, 200) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  try {
    if (action === 'approve' && id) {
      await sb.from('approval_queue').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id)
      return NextResponse.json({ ok: true })
    }
    if (action === 'reject' && id) {
      await sb.from('approval_queue').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
