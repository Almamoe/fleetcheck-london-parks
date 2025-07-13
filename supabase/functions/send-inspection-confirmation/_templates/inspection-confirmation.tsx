
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface InspectionConfirmationProps {
  reportId: string
  driverName: string
  vehicleName: string
  inspectionDate: string
  inspectionTime: string
  odometerStart: string
  odometerEnd: string
  totalMiles: number
  startEquipmentIssues: string
  endEquipmentIssues: string
  startNotes?: string
  endNotes?: string
  damageReport?: string
  comments?: string
  supervisorName: string
}

export const InspectionConfirmationEmail = ({
  reportId,
  driverName,
  vehicleName,
  inspectionDate,
  inspectionTime,
  odometerStart,
  odometerEnd,
  totalMiles,
  startEquipmentIssues,
  endEquipmentIssues,
  startNotes,
  endNotes,
  damageReport,
  comments,
  supervisorName,
}: InspectionConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Fleet Inspection Report - {reportId} - {driverName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header Section */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>🚗 Fleet Inspection Report</Heading>
              <Text style={reportIdText}>Report ID: {reportId}</Text>
              <Text style={departmentText}>City of London Parks & Recreation Department</Text>
            </Column>
          </Row>
        </Section>

        {/* Inspection Details Section */}
        <Section style={section}>
          <Heading style={h2}>📋 Inspection Details</Heading>
          <Row style={detailsGrid}>
            <Column style={detailItem}>
              <Text style={detailLabel}>Driver Name:</Text>
              <Text style={detailValue}>{driverName}</Text>
            </Column>
            <Column style={detailItem}>
              <Text style={detailLabel}>Vehicle:</Text>
              <Text style={detailValue}>{vehicleName}</Text>
            </Column>
          </Row>
          <Row style={detailsGrid}>
            <Column style={detailItem}>
              <Text style={detailLabel}>Date & Time:</Text>
              <Text style={detailValue}>{inspectionDate} at {inspectionTime}</Text>
            </Column>
            <Column style={detailItem}>
              <Text style={detailLabel}>Start Odometer:</Text>
              <Text style={detailValue}>{odometerStart || 'N/A'}</Text>
            </Column>
          </Row>
          <Row style={detailsGrid}>
            <Column style={detailItem}>
              <Text style={detailLabel}>End Odometer:</Text>
              <Text style={detailValue}>{odometerEnd || 'N/A'}</Text>
            </Column>
            {totalMiles > 0 && (
              <Column style={detailItem}>
                <Text style={detailLabel}>Total Miles:</Text>
                <Text style={detailValue}>{totalMiles}</Text>
              </Column>
            )}
          </Row>
        </Section>

        <Hr style={hr} />

        {/* Equipment Status Section */}
        <Section style={section}>
          <Heading style={h2}>🔧 Equipment Status</Heading>
          
          {/* Start of Day Equipment */}
          <Section style={noteSection}>
            <Text style={noteLabel}>Start of Day Equipment Issues:</Text>
            <Section style={startEquipmentIssues === 'None reported' ? equipmentGood : equipmentAlert}>
              <Text style={equipmentText}>
                <strong>🌅 Issues Reported:</strong> {startEquipmentIssues}
              </Text>
            </Section>
          </Section>
          
          {/* End of Day Equipment */}
          <Section style={noteSection}>
            <Text style={noteLabel}>End of Day Equipment Issues:</Text>
            <Section style={endEquipmentIssues === 'None reported' ? equipmentGood : equipmentAlert}>
              <Text style={equipmentText}>
                <strong>🌆 Issues Reported:</strong> {endEquipmentIssues}
              </Text>
            </Section>
          </Section>
        </Section>

        {/* Notes Section - Only show if there are notes */}
        {(startNotes || endNotes || damageReport || comments) && (
          <>
            <Hr style={hr} />
            <Section style={section}>
              <Heading style={h2}>📝 Additional Notes & Comments</Heading>
              
              {startNotes && (
                <Section style={noteSection}>
                  <Text style={noteLabel}>Start of Day Notes:</Text>
                  <Section style={noteContent}>
                    <Text style={noteText}>{startNotes}</Text>
                  </Section>
                </Section>
              )}
              
              {endNotes && (
                <Section style={noteSection}>
                  <Text style={noteLabel}>End of Day Notes:</Text>
                  <Section style={noteContent}>
                    <Text style={noteText}>{endNotes}</Text>
                  </Section>
                </Section>
              )}
              
              {comments && (
                <Section style={noteSection}>
                  <Text style={noteLabel}>General Comments:</Text>
                  <Section style={noteContent}>
                    <Text style={noteText}>{comments}</Text>
                  </Section>
                </Section>
              )}
              
              {damageReport && (
                <Section style={noteSection}>
                  <Text style={noteLabel}>Damage Report:</Text>
                  <Section style={noteContent}>
                    <Text style={noteText}>{damageReport}</Text>
                  </Section>
                </Section>
              )}
            </Section>
          </>
        )}

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Dear {supervisorName},
          </Text>
          <Text style={footerText}>
            This inspection report was generated on {new Date().toLocaleString()} and is ready for your review.
          </Text>
          <Text style={footerSmall}>
            FleetCheck v1.0 - City of London Parks & Recreation Department
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InspectionConfirmationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

const header = {
  padding: '30px 30px 20px',
  backgroundColor: '#059669',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  borderLeft: '4px solid #059669',
  paddingLeft: '12px',
}

const reportIdText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
  textAlign: 'center' as const,
}

const departmentText = {
  color: '#d1fae5',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
}

const section = {
  padding: '0 30px 25px',
}

const detailsGrid = {
  margin: '0 0 15px',
}

const detailItem = {
  backgroundColor: '#f9fafb',
  padding: '12px',
  borderRadius: '6px',
  margin: '0 5px 10px 0',
  minWidth: '45%',
}

const detailLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#374151',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const detailValue = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
  fontWeight: '500',
}

const equipmentGood = {
  backgroundColor: '#d1fae5',
  padding: '15px',
  borderRadius: '6px',
  borderLeft: '4px solid #10b981',
}

const equipmentAlert = {
  backgroundColor: '#fef3c7',
  padding: '15px',
  borderRadius: '6px',
  borderLeft: '4px solid #f59e0b',
}

const equipmentText = {
  fontSize: '14px',
  margin: '0',
  color: '#374151',
}

const noteSection = {
  marginBottom: '20px',
}

const noteLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  margin: '0 0 8px',
}

const noteContent = {
  backgroundColor: '#f3f4f6',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
}

const noteText = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 30px',
}

const footer = {
  padding: '0 30px 30px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 12px',
  lineHeight: '1.5',
}

const footerSmall = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '20px 0 0',
}
