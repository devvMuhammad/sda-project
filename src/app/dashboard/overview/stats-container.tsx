'use client';

import React from 'react';
import { StatCardSection } from '@/features/overview/components/stat-factory';

export default function StatsContainer() {
  const revenueData = { value: '$1,250.00', change: 12.5 };
  const customerData = { value: '1,234', change: -20 };
  const accountsData = { value: '45,678', change: 12.5 };

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      <StatCardSection type="revenue" data={revenueData} />
      <StatCardSection type="customers" data={customerData} />
      <StatCardSection type="accounts" data={accountsData} />
      {/* Fourth card - could be converted to the factory pattern as well */}
      <StatCardSection type="revenue" data={{ value: '4.5%', change: 4.5 }} />
    </div>
  );
} 