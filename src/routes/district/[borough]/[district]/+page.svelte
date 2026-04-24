<script>
  import { base } from '$app/paths';
  import DatabaseHeader from '$lib/components/Data/DatabaseHeader.svelte';
  import Dashboard from '$lib/components/Data/Dashboard.svelte';
  import BigNumber from '$lib/components/Data/BigNumber.svelte';
  import Card from '$lib/components/Data/Card.svelte';
  import MethodologyBox from '$lib/components/Article/MethodologyBox.svelte';
  import Map from '$lib/components/Maps/Map.svelte';
  import MapLayer from '$lib/components/Maps/MapLayer.svelte';
  import LocatorMap from '$lib/components/Maps/LocatorMap.svelte';

  let { data } = $props();
  let district = $derived(data.district);
  let centroid = $derived(data.centroid);
  let districtBoundary = $derived(data.districtBoundary);

  let totalOrganics = $derived(
    district.reduce((sum, r) => sum + (Number.parseFloat(r.resorganicstons) || 0), 0)
  );

  let latestMonth = $derived(
    district.slice().sort((a, b) => b.month.localeCompare(a.month))[0]?.month
  );
</script>

<DatabaseHeader
  kicker="NYC Residential Organics Collection"
  headline={`${district[0]?.borough} Community District ${district[0]?.communitydistrict}`}
>
  <Dashboard>
    <BigNumber number={totalOrganics.toFixed(1)} label="Total organics (tons)" />
    <BigNumber number={district.length} label="Months of data" />
    <BigNumber number={latestMonth} label="Most recent month" />
  </Dashboard>
  <a class="back" href={`${base}/`}>
    ← Back to ranking
  </a>

  {#snippet graphic()}
    {#if districtBoundary && centroid}
      <div class="map-frame">
        <Map
          longitude={centroid.longitude}
          latitude={centroid.latitude}
          zoom={9}
          interactive={false}
          width={260}
          aspectRatio="1 / 1"
          credit=""
        >
          <MapLayer
            id="district-fill"
            type="fill"
            data={districtBoundary}
            paint={{
              'fill-color': '#0033A1',
              'fill-opacity': 0.25,
            }}
          />
          <MapLayer
            id="district-outline"
            type="line"
            data={districtBoundary}
            paint={{
              'line-color': '#0033A1',
              'line-width': 2,
            }}
          />
        </Map>
      </div>
    {:else if centroid}
      <div class="map-frame">
        <LocatorMap
          longitude={centroid.longitude}
          latitude={centroid.latitude}
          zoom={9}
          dot={true}
          width={260}
          credit=""
        />
      </div>
    {:else}
      <p>Map unavailable for this district.</p>
    {/if}
  {/snippet}
</DatabaseHeader>

<div class="container">
  <div class="card-grid">
    {#each district.slice().sort((a, b) => b.month.localeCompare(a.month)) as row (row.month)}
      <Card>
        <p class="card-date">{row.month}</p>
        <p>{Number.parseFloat(row.resorganicstons).toFixed(1) || '—'} tons of residential organics</p>
      </Card>
    {/each}
  </div>

  <MethodologyBox>
    <p>
      The data on this page comes from the Department of Sanitation
      <a href="https://data.cityofnewyork.us/City-Government/DSNY-Monthly-Tonnage-Data/ebb3-pvjw" target="_blank">via New York City's open data portal</a>.
    </p>
    <p>
      The dataset includes monthly collection totals reported by DSNY for each community district across all five boroughs. This page focuses on residential organics tonnage, which reflects food scraps and other organic material collected curbside. The data is current as of March 2026.
    </p>
    <p>The code that executed the analysis is available as open source on GitHub.</p>
  </MethodologyBox>
</div>

<style>
  .container {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
    margin: var(--spacing-lg) 0;
  }

  :global(p.card-date) {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-accent) !important;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: var(--spacing-xs) !important;
  }

  a.back {
    display: inline-block;
    font-size: var(--font-size-xs);
    color: var(--color-text);
    text-decoration: none;
    text-transform: uppercase;
  }

  a.back:hover {
    text-decoration: underline;
  }

  .map-frame {
    width: 260px;
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
  }

  .map-frame :global(.map-figure),
  .map-frame :global(.locator-map-figure) {
    margin: 0;
  }
</style>