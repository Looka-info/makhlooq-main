'use client';

import TeamPageImpl from '../../src/components/team/page';
import Header from '../../src/components/Header';

export default function TeamPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <TeamPageImpl />
      </div>
    </>
  );
}
