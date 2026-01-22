import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrackingModule } from './tracking/tracking.module';
import { StatsModule } from './stats/stats.module';
import { SitesModule } from './sites/sites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, UsersModule, TrackingModule, StatsModule, SitesModule, NotificationsModule, AnalyticsModule, MonitoringModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
