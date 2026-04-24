import tonnage from '$lib/data/tonnage.json';

export function load() {
  return {
    showHeader: true,
    showFooter: true,
    tonnage,
  };
}