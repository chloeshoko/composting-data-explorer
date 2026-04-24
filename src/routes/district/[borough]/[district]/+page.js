import tonnage from '$lib/data/tonnage.json';
import centroids from '$lib/data/district-centroids.json';

const BOROUGH_CODE_PREFIX = {
  manhattan: '1',
  bronx: '2',
  brooklyn: '3',
  queens: '4',
  'staten island': '5',
};

async function fetchDistrictBoundary(borough, communitydistrict) {
  const prefix = BOROUGH_CODE_PREFIX[borough];
  if (!prefix) return null;

  const boroCd = `${prefix}${communitydistrict.padStart(2, '0')}`;
  const url =
    `https://data.cityofnewyork.us/resource/5crt-au7u.geojson` +
    `?%24select=the_geom%2Cboro_cd&%24where=boro_cd%3D%27${boroCd}%27`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const geojson = await response.json();
    if (!geojson?.features?.length) return null;
    return geojson;
  } catch {
    return null;
  }
}

export async function load({ params }) {
  const borough = params.borough.toLowerCase();
  const communitydistrict = params.district;

  const district = tonnage.filter(
    (r) =>
      r.borough.toLowerCase() === borough && r.communitydistrict === communitydistrict
  );

  const centroid =
    centroids.find(
      (c) => c.borough === borough && c.communitydistrict === communitydistrict
    ) ?? null;

  const districtBoundary = await fetchDistrictBoundary(borough, communitydistrict);

  return { district, centroid, districtBoundary };
}

export function entries() {
  return [
    ...new Map(
      tonnage.map((r) => [
        `${r.borough}-${r.communitydistrict}`,
        { borough: r.borough.toLowerCase(), district: r.communitydistrict },
      ])
    ).values(),
  ];
}