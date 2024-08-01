import BackButton from '../Layout/BackButton'

const LatestChangesView = () => {
  return (
    <>
      <BackButton />

      <h1 className="govuk-heading-xl govuk-!-margin-bottom-8 govuk-!-margin-top-8">
        Photo functionality in Repairs Hub
      </h1>

      <div className="latest-changes">
        <div className="download-container">
          <div>
            <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-0">
              Photo functionality user guide
            </h2>
            <p className="govuk-body-m govuk-!-margin-bottom-5 govuk-!-margin-top-5">
              This is a step-by-step guide to the new functionality, with
              annotated screenshots of the process
            </p>
          </div>

          <div className="govuk-!-margin-top-0">
            <img
              src="/assets/latest-changes-image.png"
              alt="User guide: Photo functionality in Repairs Hub"
            />
          </div>
        </div>

        <a
          download="User-guide-Photo-functionality-in-Repairs-Hub"
          className="govuk-button lbh-button govuk-!-margin-top-3=5"
          href="/assets/file_upload_user_guide.pdf"
        >
          Download
        </a>
      </div>

      <div className="govuk-body">
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What’s changing and when?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          We are introducing new functionality into Repairs Hub so you can add
          and view photos to a work order.
        </p>
        <p className="govuk-!-margin-bottom-5">
          This change will be live in Repairs Hub from Tuesday 6 August 2024.
        </p>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How will it impact how I do my job?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          We are asking <strong>operatives</strong> to add relevant photos of
          the job when closing a work order:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            This is for all circumstances - whether the repair is complete, if
            there is further work to be carried out, or if it is a no access
            job.
          </li>
          <li>
            Operatives can also add photos after they’ve closed a job using RH
            desktop.
          </li>
          <li>
            We recommend you take photos of the work as you go (eg. before,
            during and after) and can then add the photos from your Photo
            Library.
          </li>
        </ul>
        <p className="govuk-!-margin-bottom-5">
          We are asking <strong>call centre officers (RCC)</strong> to add
          photos from residents to all new work orders.
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            You can use Hackney Upload / DES to provide a link to residents so
            they can provide photos, which can then be added to a work order and
            visible to the operative.
          </li>
        </ul>
        <p className="govuk-!-margin-bottom-5">
          We are asking <strong>contractors</strong> to add photos to a job when
          closing a work order.
        </p>
        <p className="govuk-!-margin-bottom-5">
          Anyone else who has relevant photos can add them directly onto the
          work order at any time eg. supervisors.
        </p>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Why is this happening? What problems will this solve?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            A picture tells a thousand words, and at the moment there’s no way
            of attaching a photo to a work order, so there’s a lot of
            understanding we are missing out on.
          </li>
          <li>
            Currently, operatives are often taking photos of their repairs work,
            and residents are sometimes uploading photos, but these are lost
            track of with no clear place to store them.
          </li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What are the expected benefits of this change?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            This will greatly increase our collective understanding of a repairs
            job.
          </li>
          <li>It will increase our chances of resolving it more quickly.</li>
          <li>
            It will make collecting and managing evidence much more
            straightforward.
          </li>
          <li>
            This is the first step as part of a broader series of improvements
            to Repairs Hub improving the way we handle follow on jobs.
          </li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How will the photo functionality work?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            You can upload photos directly to a work order or as part of the
            work order closing process.
          </li>
          <li>You can upload up to 10 photos at a time.</li>
          <li>You can add a description of those photos.</li>
          <li>
            You can view the photos on the work order, found under the new tab
            ‘Photos’.
          </li>
          <li>
            On the ‘Photos’ tab you can see the history of all photos added to
            the work order, with the most recent at the top.
          </li>
          <li>You can see when and who added photos to the work order.</li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Why can’t it do _____ yet?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          We are starting with a simple version of the functionality so we can
          get something live sooner rather than later. We have heard from users
          that even the simplest version will add value, but we know there’s a
          lot more we could do with it.
        </p>
        <p className="govuk-!-margin-bottom-5">
          If you have suggestions for what would make this better and make it
          easier for you to do your job we would love to hear from you, and will
          be prioritising this feedback to help us determine what to do next.
        </p>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How can I get involved?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          We are actively seeking your feedback on these changes, and want to
          know how you are finding it and what would make it better.
        </p>
        <p className="govuk-!-margin-bottom-5">
          There are a couple of ways you can provide feedback.
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>Get in touch with us at.</li>
          <li>
            Come along to one of our drop in sessions at the depot or contact
            centre - we’ll be in touch with details about these.
          </li>
        </ul>
        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Where do I go if I need help?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            If you have any questions about the process or want to discuss why
            we need photos, you can talk to your supervisor.
          </li>
          <li>
            If you have any questions about the technical functionality or how
            it works, contact our Housing Product team at{' '}
            <a href="mailto:repairshub.feedback@hackney.gov.uk">
              repairshub.feedback@hackney.gov.uk
            </a>
            .
          </li>
          <li>
            Check out our{' '}
            <a href="https://sites.google.com/hackney.gov.uk/repairshubsupport">
              user guide
            </a>
            .
          </li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What other changes can I expect?
        </h2>
        <p className="govuk-!-margin-bottom-5">
          Over the coming weeks and months, we will be regularly delivering
          improvements to Repairs Hub, with a focus on improving the way we
          manage follow on jobs.
        </p>

        <ul className="govuk-list govuk-list--bullet">
          <li>
            The next significant change will be to the way we close work orders.
            It introduces a more structured way to capture details for when
            there is further work required, and removes the need for completing
            the follow ons Google form.
          </li>
          <li>
            The third significant change will be to the way we raise work
            orders. It will establish a link between related work orders, so we
            can understand which ones are follow ons, what they are following on
            from, and the end-to-end timeline of a repairs job.
          </li>
        </ul>

        <p className="govuk-!-margin-bottom-5">
          We will continue to provide more information about these changes over
          the next few weeks.
        </p>
      </div>
    </>
  )
}

export default LatestChangesView
