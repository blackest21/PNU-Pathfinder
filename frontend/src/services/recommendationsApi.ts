import type { OpportunityRecommendations } from '../types';
import { request } from './apiClient';

export function getOpportunityRecommendations(token: string): Promise<OpportunityRecommendations> {
  return request<OpportunityRecommendations>('/api/recommendations/opportunities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
