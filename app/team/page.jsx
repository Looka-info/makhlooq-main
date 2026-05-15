'use client';

import TeamPageImpl from '../../src/components/team/page';
import PageNavigationButtons from '../../src/components/PageNavigationButtons';

export default function TeamPage() {
  return (
    <>
      <PageNavigationButtons current="/team" />
      <TeamPageImpl />
    </>
  );
}
