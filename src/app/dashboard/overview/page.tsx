import StatsContainer from './stats-container';

export const metadata = {
  title: 'Dashboard : Overview'
};

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Using the factory pattern for stats cards */}
      <StatsContainer />

      {/* Other content remains the same, handled by layout.tsx */}
    </div>
  );
} 