import WidgetClient from './WidgetClient';

export const metadata = {
  title: 'FleetYards Widget',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FleetWidgetPage({ searchParams }) {
  const ships = String(searchParams?.ships || '')
    .split(',')
    .map(ship => ship.trim())
    .filter(Boolean);

  return <WidgetClient ships={ships} />;
}
