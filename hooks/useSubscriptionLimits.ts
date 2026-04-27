'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PLAN_LIMITS, PlanType, PlanLimits } from '@/lib/planLimits';

export function useSubscriptionLimits() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanType>('basic');
  const [usage, setUsage] = useState({
    listings: 0,
    aiCaptions: 0,
  });
  const [limits, setLimits] = useState<PlanLimits>(PLAN_LIMITS.basic);

  const supabase = createClient();

  const fetchLimits = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get User Profile/Plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      const userPlan = (profile?.subscription_plan as PlanType) || 'basic';
      setPlan(userPlan);
      setLimits(PLAN_LIMITS[userPlan]);

      // 2. Get Current Listing Count
      const { count: listingCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // 3. Get AI Caption Usage (for current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: aiLogs } = await supabase
        .from('usage_logs')
        .select('count')
        .eq('user_id', user.id)
        .eq('feature_type', 'ai_caption')
        .gte('created_at', startOfMonth.toISOString());

      const aiCount = aiLogs?.reduce((acc: number, log: any) => acc + log.count, 0) || 0;

      setUsage({
        listings: listingCount || 0,
        aiCaptions: aiCount,
      });

    } catch (error) {
      console.error('Error fetching subscription limits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const checkLimit = (type: 'listings' | 'aiCaptions') => {
    return usage[type] < limits[type];
  };

  return {
    loading,
    plan,
    usage,
    limits,
    checkLimit,
    refresh: fetchLimits
  };
}
