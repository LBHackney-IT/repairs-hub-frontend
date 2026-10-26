import Image from 'next/image'
import BackButton from '../Layout/BackButton'
import closeWorkOrder from '../../../public/images/closeworkorder.jpg'
import detailsOfFurtherWork from '../../../public/images/detailsoffurtherwork.jpg'
import additionalNotes from '../../../public/images/additionalnotes.jpg'

const LatestChangesView = () => {
  return (
    <>
      <BackButton />

      <h1 className="govuk-heading-xl govuk-!-margin-bottom-8 govuk-!-margin-top-8">
        Follow on functionality in Repairs Hub
      </h1>

      <div className="govuk-body">
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What’s changing and when?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          We’re introducing new functionality so operatives can now report
          Follow Ons on Repairs Hub.
        </p>
        <p className="govuk-!-margin-bottom-5">
          This change will be live on{' '}
          <strong>Thursday December 5th 2024.</strong>
        </p>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What is changing?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          When you close a work order, you will be able to record a follow on
          within the app instead of having to use the google form.
          <br />
          To start the process you just need to tap that ‘Further work is
          required’ which will appear after you click ‘Visit completed’ when
          closing the work order:
        </p>

        <img
          src={
            'https://utfs.io/f/LyeuJKNx8XNMzCPPFPV93VZFHvqYSbREJAIzm5QKgl1tGNf8'
          }
          style={{ width: '100%', maxWidth: '600px' }}
        />

        <p className="govuk-!-margin-bottom-5">
          You can still add your photos that are relevant to the job you have
          completed and add in your final report.
        </p>

        <p className="govuk-!-margin-bottom-5">
          You will then be taken to the ‘Details of further work required’ page,
          which operates similarly to the google form and should be straight
          forward to fill out, if you encounter any problems please call your
          supervisor.
          <br />
          Before you raise a follow on you should call your supervisor to get
          their approval, if this is not possible, you can tick ‘no’ for the
          first question.
        </p>

        <img
          src={
            'https://utfs.io/f/LyeuJKNx8XNM7RAMNRdcmBP8ifDT9S7EdU0bwq3uMIpt2sGJ'
          }
          style={{ width: '100%', maxWidth: '600px' }}
        />

        <p className="govuk-!-margin-bottom-5">
          At the bottom of the follow on form you will be able to add photos to
          support the further work needed and add any additional information
          that will help the admin team raise the new work order:
        </p>

        <img
          src={
            'https://utfs.io/f/LyeuJKNx8XNMmsJbR2Lt5267gjA0LKNvqwdGbJMUYBDhilkn'
          }
          style={{ width: '100%', maxWidth: '600px' }}
        />

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How will it impact how I do my job?
        </h2>

        <p className="govuk-!-margin-bottom-5">
          For operatives, this will mean that they no longer need to fill out a
          separate Google Form to report Follow Ons. They will now be able to
          share this information when they close their jobs on Repairs Hub.
        </p>

        <p className="govuk-!-margin-bottom-5">
          For Repairs’ Admin, the Follow ons process will remain largely the
          same. They will continue to get this information via email. The only
          difference will be that they will receive this information as simple
          text in the email instead of PDFs.
        </p>

        <p className="govuk-!-margin-bottom-5">
          There are some changes in the questions displayed on the follow on
          form and information sent via email, this is the result of extensive
          user testing, process redesign and senior stakeholder input.
        </p>

        <p className="govuk-!-margin-bottom-5">
          As we transition from the old process to the new, we are mindful that
          we might experience minor glitches with Repairs Hub. Thus the Google
          form will still be available to operatives to use in exceptional
          circumstances.
        </p>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Why is this happening? What problems will this solve?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            We want to make the process of reporting Follow Ons simpler for
            operatives. These changes will mean that they can do everything on
            Repairs Hub and will not need to use secondary tools like Google
            Forms.
          </li>
          <li>
            The new form encourages operatives to type out more information and
            approach reporting a follow on differently. The aim is to improve
            the quality of information included.
          </li>
          <li>
            The new form has less questions and input fields than the google
            form, meaning that while the operative will have to type answers,
            the number of answers needed has reduced, hopefully improving the
            efficiency of the process.
          </li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Where do I go if I need help?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            If you have any questions about the process or want to discuss why
            we need these changes, you can talk to your supervisor.
          </li>
          <li>
            If you have any questions about the technical functionality or how
            it works, contact our Housing Product team at{' '}
            <a href="mailto:repairshub.feedback@hackney.gov.uk">
              repairshub.feedback@hackney.gov.uk
            </a>
          </li>
          <li>
            Check out our{' '}
            <a href="https://docs.google.com/presentation/d/1OkVrR67R5FzU4Okz13guFZ2-m3LTwn8HE1KsB-3XLxA/edit#slide=id.p">
              user guide
            </a>
            .
          </li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What other changes can I expect?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            We will be looking to implement our final set of follow on changes
            in the new year.
          </li>
          <li>
            We will be releasing small improvements to Repairs Hub continuously
            over the next month so expect more communication from us.
          </li>
        </ul>
      </div>
    </>
  )
}

export default LatestChangesView
