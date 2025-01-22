import { Injectable } from '@nestjs/common';
import PDFKit = require('pdfkit');
import { User } from '../../entities/user.entity';
import { UserMetricsDto } from '../dto/user-metrics.dto';
import { ActivityLog } from '../../entities/activity-log.entity';

@Injectable()
export class PdfGeneratorService {
  async generateUserReport(
    doc: typeof PDFKit,
    user: User,
    metrics: UserMetricsDto,
    recentActivities: ActivityLog[],
  ) {
    // Set page margins
    doc.page.margins = { top: 50, bottom: 50, left: 50, right: 50 };

    // Header
    doc
      .fillColor('#1a73e8')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('User Activity Report', { align: 'center' })
      .moveDown(2);

    // User Info Section with more spacing
    doc
      .fillColor('#333')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('User Information')
      .moveDown(1);

    const userInfoTable = {
      headers: ['Field', 'Value'],
      rows: [
        ['Name', `${user.firstName} ${user.lastName}`],
        ['Email', user.email],
        ['Role', user.role],
      ],
    };

    await this.drawTable(doc, userInfoTable, 30);
    doc.moveDown(2);

    // Metrics Section
    doc
      .fillColor('#1a73e8')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Activity Metrics')
      .moveDown(1);

    const metricsTable = {
      headers: ['Metric', 'Value'],
      rows: [
        ['Total Activities', metrics.totalActivities.toString()],
        ['Last Activity', metrics.lastActivityDate?.toLocaleString() || 'N/A'],
      ],
    };

    await this.drawTable(doc, metricsTable, 30);
    doc.moveDown(2);

    // Check if need new page
    if (doc.y > 500) doc.addPage();

    // Activity Breakdown
    doc
      .fillColor('#1a73e8')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Activity Breakdown')
      .moveDown(1);

    const breakdownTable = {
      headers: ['Activity Type', 'Count'],
      rows: Object.entries(metrics.activityBreakdown),
    };

    await this.drawTable(doc, breakdownTable, 30);
    doc.moveDown(2);

    // Check if need new page
    if (doc.y > 500) doc.addPage();

    // Recent Activities
    doc
      .fillColor('#1a73e8')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Recent Activities')
      .moveDown(1);

    const recentActivitiesTable = {
      headers: ['Date', 'Action', 'Description'],
      rows: recentActivities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        activity.action,
        activity.description || 'N/A',
      ]),
    };

    await this.drawTable(doc, recentActivitiesTable, 40);

    // Footer
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor('#666')
      .text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });
  }

  private async drawTable(doc: typeof PDFKit, table: { headers: string[], rows: any[][] }, rowHeight: number) {
    const pageWidth = doc.page.width - 100;
    const columnWidth = pageWidth / table.headers.length;
    const padding = 10;  // Add padding

    // Headers
    const headerY = doc.y;
    doc
      .fillColor('#1a73e8')
      .rect(50, headerY, pageWidth, rowHeight)
      .fill();

    doc.fillColor('#ffffff');
    table.headers.forEach((header, i) => {
      doc.text(
        header,
        50 + (i * columnWidth) + padding,
        headerY + padding,
        {
          width: columnWidth - (padding * 2),
          align: 'center',
          lineBreak: false
        }
      );
    });

    doc.moveDown(1.5);  // Increased spacing after headers

    // Rows
    table.rows.forEach((row, i) => {
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
        const newHeaderY = 50;
        
        // Redraw headers on new page
        doc
          .fillColor('#1a73e8')
          .rect(50, newHeaderY, pageWidth, rowHeight)
          .fill();

        doc.fillColor('#ffffff');
        table.headers.forEach((header, j) => {
          doc.text(
            header,
            50 + (j * columnWidth) + padding,
            newHeaderY + padding,
            {
              width: columnWidth - (padding * 2),
              align: 'center',
              lineBreak: false
            }
          );
        });
        doc.moveDown(2);  // More space after headers on new page
      }

      const rowY = doc.y;
      
      // Row background
      doc
        .fillColor(i % 2 === 0 ? '#f8f9fa' : '#ffffff')
        .rect(50, rowY, pageWidth, rowHeight)
        .fill();

      // Row content
      doc.fillColor('#333');
      row.forEach((cell, j) => {
        const text = cell?.toString() || 'N/A';
        doc.text(
          text,
          50 + (j * columnWidth) + padding,
          rowY + padding,
          {
            width: columnWidth - (padding * 2),
            align: 'center',
            lineBreak: true,
            height: rowHeight - (padding * 2)  // Limit text height
          }
        );
      });

      doc.moveDown(2);  // Increased spacing between rows
    });

    doc.moveDown(1);
  }
} 