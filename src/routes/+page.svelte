<script>
  import { base } from '$app/paths';
  import DatabaseHeader from '$lib/components/Data/DatabaseHeader.svelte';
  import RankingList from '$lib/components/Data/RankingList.svelte';
  import RankingCard from '$lib/components/Data/RankingCard.svelte';
  import SearchInput from '$lib/components/Forms/SearchInput.svelte';
  import DropdownInput from '$lib/components/Forms/DropdownInput.svelte';
  import MethodologyBox from '$lib/components/Article/MethodologyBox.svelte';

  let { data } = $props();

  let search = $state('');
  let borough = $state('');

  const boroughOptions = [
    { value: 'bronx', label: 'Bronx' },
    { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'manhattan', label: 'Manhattan' },
    { value: 'queens', label: 'Queens' },
    { value: 'staten island', label: 'Staten Island' },
  ];

  function handleBoroughChange(event) {
    borough = event.target.value;
  }

  let top20 = $derived(
    [...data.tonnage]
      .filter((district) => district.month.startsWith('2025'))
      .filter((district) => {
        if (!borough) return true;
        return district.borough.toLowerCase() === borough;
      })
      .filter((district) => {
        let query = search.trim().toLowerCase();
        if (!query) return true;

        let location = `${district.borough} Community District ${district.communitydistrict}`.toLowerCase();
        return location.includes(query);
      })
      .sort(
        (a, b) =>
          Number.parseFloat(b.resorganicstons) - Number.parseFloat(a.resorganicstons)
      )
      .slice(0, 20)
  );
</script>

<DatabaseHeader
  kicker="Data Explorer"
  headline="NYC Residential Organics Collection, 2025"
  description="Monthly residential organics tonnage collected by borough across New York City in 2025"
  byline="Chloe Shoko Rogers"
  date="2025 data"
  >
  <div class="filter-row">
    <div class="search-wrapper">
      <SearchInput bind:value={search} placeholder="Search district..." />
    </div>
    <div class="borough-wrapper">
      <DropdownInput
        label="Filter borough"
        placeholder="All boroughs"
        options={boroughOptions}
        value={borough}
        onchange={handleBoroughChange}
      />
    </div>
  </div>
</DatabaseHeader>

<div class="container">
  <RankingList
    title={
      search || borough
        ? `Showing top ${top20.length} results in 2025`
        : 'Top 20 districts by monthly organics tonnage in 2025'
    }
  >
    {#each top20 as district, index (`${district.month}-${district.borough_id}-${district.communitydistrict}`)}
      <RankingCard
        rank={index + 1}
        title={`${district.borough} Community District ${district.communitydistrict}`}
        href={`${base}/district/${encodeURIComponent(district.borough.toLowerCase())}/${encodeURIComponent(district.communitydistrict)}`}
        description={district.month}
        value={district.resorganicstons}
        valueLabel="tons"
      />
    {/each}
  </RankingList>

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
  }

  .search-wrapper {
    max-width: 600px;
    flex: 1;
  }

  .borough-wrapper {
    width: 260px;
  }

  .filter-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  @media (min-width: 768px) {
    .filter-row {
      flex-direction: row;
      align-items: end;
    }
  }
</style>