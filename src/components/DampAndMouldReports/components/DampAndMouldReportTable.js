const { Table, THead, TR, TH, TBody, TD } = require('../../Layout/Table')

import Link from 'next/link'
import { dateToStr } from '../../../utils/date'
import TruncateText from '../../Layout/TruncateText'
import DampAndMouldStatus from './DampAndMouldStatus'
import ReportFrequencyBadge from './ReportFrequencyBadge'

const DampAndMouldReportTable = ({
  reports,
  showAdditionalPropertyInfo = true,
}) => {
  return (
    <div className="damp-and-mould-report-table">
      <Table className="govuk-!-margin-top-5 govuk-!-width-full hackney-work-order-table">
        <THead>
          <TR className="lbh-body">
            <TH scope="col" className="lbh-body-xs">
              Date reported
            </TH>
            {showAdditionalPropertyInfo && (
              <TH scope="col" className="lbh-body-xs">
                Property
              </TH>
            )}
            <TH scope="col" className="lbh-body-xs">
              Damp/Mould presence
            </TH>
            <TH scope="col" className="lbh-body-xs">
              Previously reported
            </TH>
            <TH scope="col" className="lbh-body-xs">
              Comments
            </TH>
            {showAdditionalPropertyInfo && (
              <TH scope="col" className="lbh-body-xs">
                Other reports
              </TH>
            )}
          </TR>
        </THead>
        <TBody>
          {reports.map((report) => (
            <TR
              key={report.id}
              reference={report.id}
              className="govuk-table__row--clickable lbh-body-s hackney-work-order-table"
            >
              <TD className="lbh-body-xs">{dateToStr(report.reportedAt)}</TD>
              {showAdditionalPropertyInfo && (
                <TD className="lbh-body-xs">
                  <span className="damp-and-mould-address">
                    {report.address}
                  </span>

                  <ReportFrequencyBadge
                    numberOfReports={report.numberOfRecentReportsForProperty}
                    reportedAt={report.reportedAt}
                  />
                </TD>
              )}
              <TD className="lbh-body-xs">
                <DampAndMouldStatus
                  variant={
                    report.dampAndMouldPresenceConfirmed
                      ? 'confirmed'
                      : 'unconfirmed'
                  }
                >
                  {report.dampAndMouldPresenceConfirmed
                    ? 'Confirmed'
                    : 'Unconfirmed'}
                </DampAndMouldStatus>
              </TD>
              <TD className="lbh-body-xs">
                {report.previouslyReported && (
                  <DampAndMouldStatus
                    variant={
                      report.previousReportResolved ? 'resolved' : 'unresolved'
                    }
                  >
                    {report.previousReportResolved ? 'Resolved' : 'Unresolved'}
                  </DampAndMouldStatus>
                )}
              </TD>
              <TD className="description lbh-body-xs">
                <TruncateText
                  text={report.comments}
                  numberOfLines="5"
                  linkClassName="description lbh-body-xs"
                />
              </TD>
              {showAdditionalPropertyInfo && (
                <TD>
                  <Link
                    href={`damp-and-mould-reports/${report.propertyReference}`}
                  >
                    <a style={{ fontSize: '14px' }} className="lbh-link">
                      View all reports
                    </a>
                  </Link>
                </TD>
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

export default DampAndMouldReportTable
