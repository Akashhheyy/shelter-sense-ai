import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { apiGet, apiPostFlexible, type ApiError } from "@/lib/api";
import { extractList, type Record$ } from "@/lib/fields";

/** True only after hydration, so we never call the API during SSR/prerender. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useHealth() {
  const hydrated = useHydrated();
  return useQuery<Record$>({
    queryKey: ["health"],
    queryFn: () => apiGet<Record$>("/health"),
    enabled: hydrated,
    retry: false,
    staleTime: 30_000,
  });
}

export function useDesigns() {
  const hydrated = useHydrated();
  return useQuery({
    queryKey: ["designs"],
    queryFn: async () => extractList(await apiGet("/designs")),
    enabled: hydrated,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useScenarios() {
  const hydrated = useHydrated();
  return useQuery({
    queryKey: ["scenarios"],
    queryFn: async () => extractList(await apiGet("/scenarios")),
    enabled: hydrated,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

type Selection = { designId: string; scenarioId: string };

const designScenarioBodies = ({ designId, scenarioId }: Selection): Array<Record<string, unknown>> => [
  { design_id: designId, scenario_id: scenarioId },
  { design_id: designId, weather_scenario_id: scenarioId },
  { designId, scenarioId },
  { design: designId, scenario: scenarioId },
];

export function usePredict() {
  return useMutation<Record$, ApiError, Selection>({
    mutationFn: (selection) => apiPostFlexible<Record$>("/predict", designScenarioBodies(selection)),
  });
}

export function useCompare() {
  return useMutation<Record$, ApiError, Selection>({
    mutationFn: (selection) => apiPostFlexible<Record$>("/compare", designScenarioBodies(selection)),
  });
}

export function useRecommend() {
  return useMutation<Record$, ApiError, { scenarioId: string; topN: number }>({
    mutationFn: ({ scenarioId, topN }) =>
      apiPostFlexible<Record$>("/recommend", [
        { scenario_id: scenarioId, top_n: topN },
        { scenario_id: scenarioId, top_k: topN },
        { weather_scenario_id: scenarioId, top_n: topN },
        { scenario_id: scenarioId },
        { scenarioId, topN },
      ]),
  });
}
