import { Expense, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import StatsMobileLayout from '@/layouts/mobile/stats-mobile-layout';
import GoalsMobileLayout from '@/layouts/mobile/goals-mobile-layout';

interface StatsProps{
    expenses : Expense[];
}

export default function Goals({expenses} : StatsProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Stats">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <GoalsMobileLayout>
                goals
            </GoalsMobileLayout>
        </>
    );
}
