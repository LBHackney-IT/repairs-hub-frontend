import BackButton from '../Layout/BackButton'

const LatestChangesView = () => {
  return (
    <>
      <BackButton />
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-5 govuk-!-margin-top-5">
        Photo functionality in Repairs Hub
      </h1>

      <div className="govuk-body">
        <div class="govuk-inset-text lbh-inset-text">
          {/* Photo functionality user guide [insert link once we have it]. */}
          This is a visual guide of the new functionality, with annotated
          screenshots of the process to add and view
        </div>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What’s changing and when?
        </h2>

        <p>
          We have introduced new functionality into Repairs Hub. This means you
          are able to add and view photos on a work order.
        </p>

        <p>This change was live in Repairs Hub from [insert date].</p>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How will it impact how I do my job?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            We are asking operatives to add relevant photos of the job when
            closing a work order
          </li>
          <li>
            This is for all circumstances - whether the repair is complete, if
            there is further work to be carried out, or if it is a no access job
          </li>
          <li>
            Operatives can also add photos after they’ve closed a job using RH
            desktop
          </li>
          <li>
            We are asking RCC agents to add photos from residents to a work
            order
          </li>
          <li>
            You can use Hackney Upload / DES to provide a link to residents for
            them to provide photos
          </li>
          <li>
            Anyone else who has relevant photos can add them directly onto the
            work order at any time eg. supervisors
          </li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Why is this happening? What problems will this solve?{' '}
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            A picture tells a thousand words, and previously there was no way of
            attaching a photo to a work order, so there’s a lot of understanding
            we were missing out on
          </li>
          <li>
            Operatives are often taking photos of their repairs work, and
            residents are sometimes providing photos, but it was easy to lose
            track of these with no clear place to store them
          </li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What are the expected benefits of this change?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            This will greatly increase our collective understanding of a repairs
            job
          </li>
          <li>It will increase our chances of resolving it more quickly</li>
          <li>
            It will make collecting and managing evidence much more
            straightforward
          </li>
          <li>
            This is the first step as part of a broader series of improvements
            to Repairs Hub improving the way we handle follow on jobs
          </li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How does the photo functionality work?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            You can upload photos directly to a work order or as part of the
            work order closing process
          </li>
          <li>You can upload up to 10 photos at a time</li>
          <li>You can add a description of those photos</li>
          <li>
            You can view the photos on the work order, found under a new tab
            ‘Photos’
          </li>
          <li>
            On the ‘Photos’ tab you can see the history off all photos added to
            the work order, with the most recent at the top
          </li>
          <li>You can see who added the photos and when</li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Why can’t it do _____ yet?
        </h2>

        <p>
          We are starting with a simple version of the functionality so we can
          get something live sooner rather than later. We are starting with a
          simple version of the functionality so we can get something live
          sooner rather than later.
        </p>

        <p>
          If you have suggestions for what would make this better and make it
          easier for you to do your job we would love to hear from you, and will
          be prioritising this feedback to help us determine what to do next.
        </p>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          How can I get involved?
        </h2>

        <p className='govuk-!-margin-bottom-5'>
          We are actively seeking your feedback on these changes, and want to
          know how you are finding it and what would make it better. There are a
          couple of ways you can provide feedback:
        </p>

        <ul className="govuk-list govuk-list--bullet">
          <li>
            <a
              class="lbh-link"
              title="feedback"
              href="mailto:repairshub.feedback@hackney.gov.uk"
            >
              Send us an email
            </a>
          </li>
          <li>Come along to one of our drop in sessions</li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          Where do I go if I need help?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            If you have any questions about the process or want to discuss why
            we need photos, you can talk to your supervisor
          </li>
          <li>
            If you have any questions about the technical functionality or how
            it works, contact our Housing Product team at [insert contact
            details]{' '}
          </li>
          <li>
            Check out our{' '}
            <a className="lbh-link" href={process.env.NEXT_PUBLIC_SUPPORT_LINK}>
              user guide
            </a>
          </li>
        </ul>

        <h2 className="govuk-heading-l govuk-!-margin-bottom-5 govuk-!-margin-top-8">
          What other changes can I expect?
        </h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            Over the coming weeks and months we will be regularly delivering
            improvements to Repairs Hub, with a focus on improving the way we
            manage follow on jobs
          </li>
          <li>
            The next significant change will be to the way we close work orders.
            It is introducing a more structured way to capture details for when
            there is further work required, and removes the need for completing
            the follow ons Google form
          </li>
          <li>
            The third significant change will be to the way we raise work
            orders. It will establish a link between related work orders, so we
            can understand which ones are follow ons, what they are following on
            from, and the end-to-end timeline of a repairs job.
          </li>
          <li>
            We will continue to provide more information about these changes
            over the next few weeks.
          </li>
        </ul>
      </div>
    </>
  )
}

export default LatestChangesView
