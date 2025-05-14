'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

// Abstract product
export interface StatCard {
  render(): React.ReactNode;
}

// Concrete products
export class RevenueStatCard implements StatCard {
  private data: { value: string; change: number };

  constructor(data: { value: string; change: number }) {
    this.data = data;
  }

  render() {
    const { value, change } = this.data;
    const isPositive = change >= 0;

    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {value}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
              {isPositive ? '+' : ''}{change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {isPositive ? 'Trending up this month' : 'Trending down this month'}
            {isPositive ? <IconTrendingUp className='size-4' /> : <IconTrendingDown className='size-4' />}
          </div>
          <div className='text-muted-foreground'>
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    );
  }
}

export class CustomerStatCard implements StatCard {
  private data: { value: string; change: number };

  constructor(data: { value: string; change: number }) {
    this.data = data;
  }

  render() {
    const { value, change } = this.data;
    const isPositive = change >= 0;

    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {value}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
              {isPositive ? '+' : ''}{change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {isPositive ? 'Up' : 'Down'} {Math.abs(change)}% this period
            {isPositive ? <IconTrendingUp className='size-4' /> : <IconTrendingDown className='size-4' />}
          </div>
          <div className='text-muted-foreground'>
            {isPositive ? 'Acquisition exceeding goals' : 'Acquisition needs attention'}
          </div>
        </CardFooter>
      </Card>
    );
  }
}

export class AccountsStatCard implements StatCard {
  private data: { value: string; change: number };

  constructor(data: { value: string; change: number }) {
    this.data = data;
  }

  render() {
    const { value, change } = this.data;
    const isPositive = change >= 0;

    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {value}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
              {isPositive ? '+' : ''}{change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {isPositive ? 'Strong user retention' : 'User retention issues'}
            {isPositive ? <IconTrendingUp className='size-4' /> : <IconTrendingDown className='size-4' />}
          </div>
          <div className='text-muted-foreground'>
            {isPositive ? 'Engagement exceed targets' : 'Engagement below targets'}
          </div>
        </CardFooter>
      </Card>
    );
  }
}

// Abstract factory
export abstract class StatCardFactory {
  abstract createStatCard(data: any): StatCard;
}

// Concrete factories
export class RevenueStatCardFactory extends StatCardFactory {
  createStatCard(data: { value: string; change: number }): StatCard {
    return new RevenueStatCard(data);
  }
}

export class CustomerStatCardFactory extends StatCardFactory {
  createStatCard(data: { value: string; change: number }): StatCard {
    return new CustomerStatCard(data);
  }
}

export class AccountsStatCardFactory extends StatCardFactory {
  createStatCard(data: { value: string; change: number }): StatCard {
    return new AccountsStatCard(data);
  }
}

// Client component using the factory
export function StatCardSection({ type, data }: { type: 'revenue' | 'customers' | 'accounts'; data: any }) {
  let factory: StatCardFactory;

  if (type === 'revenue') {
    factory = new RevenueStatCardFactory();
  } else if (type === 'customers') {
    factory = new CustomerStatCardFactory();
  } else {
    factory = new AccountsStatCardFactory();
  }

  const statCard = factory.createStatCard(data);
  return <>{statCard.render()}</>;
} 