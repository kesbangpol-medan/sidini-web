import AppDashboard from '@/components/dashboards/dashboard'
import React from 'react'

export default function Dashboard() {
  return (
    <AppDashboard content={<div>
        ini konten dashboard
    </div>} activeKey={'dashboard'} />
  )
}
