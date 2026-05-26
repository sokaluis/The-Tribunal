export const en: Record<string, string> = {
  // Navigation
  'nav.new_trial': 'New Trial',
  'nav.gallery': 'Gallery',
  'nav.checking_session': 'Checking session...',
  'nav.sign_out': 'Sign out',
  'nav.sign_in': 'Sign in',
  'nav.back_new_trial': '← New trial',

  // Hero
  'hero.badge': 'The court is in session',
  'hero.headline_1': 'Put yourself',
  'hero.headline_2': 'on trial.',
  'hero.subtitle':
    'Submit a dilemma, confession, opinion, or idea. A panel of AI judges will prosecute it, defend it, and deliver a verdict.',

  // Home page
  'home.filing_case': 'Filing case...',
  'home.start_trial': 'Start Trial',
  'home.submit_hint':
    'Press Cmd+Enter to submit — or Ctrl+Enter on Windows',
  'home.sample_verdict': 'Sample verdict',
  'home.verdict_card_title': 'The verdict card',
  'home.verdict_card_desc':
    'Every trial produces a shareable verdict card. Download it as an image, copy the text, or post it as-is.',
  'home.cta_title': 'The court awaits.',
  'home.cta_subtitle':
    'Submit a dilemma, confession, opinion, or idea. The AI judges have seen everything and judged worse.',
  'home.cta_button': 'Start Trial',
  'home.examples_label': 'Or try one of these',
  'home.sample_score_label': 'Asshole Score',

  // How it works
  'how.section_label': 'Procedure',
  'how.title': 'How it works',
  'how.step_1_title': 'File your case',
  'how.step_1_body':
    'Submit a dilemma, confession, opinion, or idea. The court accepts all submissions in good faith.',
  'how.step_2_title': 'The court deliberates',
  'how.step_2_body':
    'A prosecutor, defender, and panel of specialized judges all weigh in — each with a distinct lens and no mercy.',
  'how.step_3_title': 'The verdict is delivered',
  'how.step_3_body':
    'A final judge synthesizes the arguments and delivers a ruling, a score, and a sentence. The verdict is shareable.',

  // Case input
  'case.min_chars': 'Need at least {count} characters to file a case.',

  // Error state
  'error.title': 'The court is in disarray.',
  'error.default_message':
    'Something went wrong during the trial. The evidence has been misplaced. Please try again.',
  'error.retry': 'Retry',
  'error.file_new_case': 'File a new case',

  // Trial progress
  'progress.step_0_sublabel':
    'Your submission is in the hands of the court.',
  'progress.step_1_label': 'Case filed.',
  'progress.step_1_sublabel':
    'The clerk is reviewing your submission.',
  'progress.step_2_label':
    'The prosecution is sharpening its knives.',
  'progress.step_2_sublabel':
    'The defense is also preparing. They are less enthusiastic.',
  'progress.step_3_label':
    'The judges are pretending to be impartial.',
  'progress.step_3_sublabel':
    'The panel has reviewed all arguments and is deliberating.',
  'progress.step_4_label': 'The verdict is being sealed.',
  'progress.step_4_sublabel':
    'The final judge is composing the ruling. This is the dramatic part.',
  'progress.duration': 'Trials typically take 20-40 seconds',

  // Safety blocked
  'safety.we_see_you': 'We see you.',
  'safety.case_dismissed': 'Case dismissed.',
  'safety.support': 'If you need support',
  'safety.return': '← Return to The Tribunal',

  // Share buttons
  'share.copy_verdict': '📋 Copy verdict',
  'share.copied': '✓ Copied!',
  'share.copy_failed': 'Copy failed',
  'share.download_card': '⬇ Download card',
  'share.generating': '⏳ Generating...',
  'share.horizontal': 'Horizontal',
  'share.horizontal_desc': 'Wide format (900 x ~300px)',
  'share.vertical': 'Vertical',
  'share.vertical_desc': 'Tall format (520 x ~680px)',

  // Appeal selector
  'appeal.button': '⚖ Appeal this verdict',
  'appeal.title': 'File an appeal',
  'appeal.choose_court': 'Choose the court for your appeal',
  'appeal.choose_court_hint':
    'You may ask the same court to reconsider, or take the appeal to a different tribunal.',
  'appeal.current_court': 'Current court',
  'appeal.grounds': 'Grounds for appeal',
  'appeal.explain': 'Explain your appeal',
  'appeal.explain_hint': '(strongly encouraged)',
  'appeal.placeholder':
    'Why do you believe the original verdict was wrong? What did the court miss?',
  'appeal.filing': 'Filing appeal...',
  'appeal.submit': 'File appeal',
  'appeal.cancel': 'Cancel',

  // Appeal ground labels (shared with server i18n contract)
  'appeal.ground.new_context': 'New context or evidence was missing from the original trial',
  'appeal.ground.wrong_tribunal': 'The case was judged by the wrong kind of tribunal',
  'appeal.ground.mitigating_context_ignored': 'The original court ignored important mitigating circumstances',
  'appeal.ground.sentence_too_harsh': 'The verdict may be fair, but the sentence was excessive',
  'appeal.ground.reasoning_flawed': "The original court's reasoning was inconsistent, unfair, or missed the point",
  'appeal.ground.verdict_too_soft': 'The original court was too lenient',

  // Trial transcript
  'transcript.arguments': 'The Arguments',
  'transcript.panel': 'The Panel',
  'transcript.case': 'The Case',
  'transcript.ruling': 'The Ruling',

  // Tribunal selector
  'tribunal.choose_court': 'Choose your court',
  'tribunal.tone': 'Tone',
  'tribunal.score': 'Score',
  'tribunal.panel': 'Panel',

  // Judgment card
  'judgment.guilty': 'Guilty',
  'judgment.not_guilty': 'Not Guilty',
  'judgment.complicated': 'Complicated',

  // Trial page
  'trial.appellate_hearing': 'Appellate Hearing',
  'trial.appeal_of': 'Appeal of',
  'trial.original_verdict': 'original verdict',
  'trial.on_grounds': 'on grounds:',
  'trial.appellate_spoken': 'The Appellate Tribunal has spoken',
  'trial.tribunal_spoken': 'The Tribunal has spoken',
  'trial.published': '✓ Published to The Gallery',
  'trial.publish_confirm':
    'This will make your case publicly visible in The Gallery.',
  'trial.confirm': 'Confirm',
  'trial.cancel': 'Cancel',
  'trial.publishing': 'Publishing...',
  'trial.publish': '🌐 Publish to The Gallery',
  'trial.appeal_tag': 'Appeal',

  // Gallery page
  'gallery.public_verdicts': 'Public verdicts',
  'gallery.title': 'The Gallery',
  'gallery.subtitle':
    'A collection of cases the court has already ruled on.',
  'gallery.sort': 'Sort',
  'gallery.sort_latest': 'Latest',
  'gallery.sort_condemned': 'Most condemned',
  'gallery.sort_vindicated': 'Most vindicated',
  'gallery.sort_contested': 'Most contested',
  'gallery.loading': 'Retrieving case files...',
  'gallery.empty': 'No cases have been filed yet.',
  'gallery.view_case': 'View full case →',
  'gallery.ready': 'Ready to face judgment?',
  'gallery.file_case': 'File your case',

  // Profile page
  'profile.status_pending': 'Pending',
  'profile.status_processing': 'Processing',
  'profile.status_completed': 'Completed',
  'profile.status_failed': 'Failed',
  'profile.status_safety_blocked': 'Safety blocked',
  'profile.public': 'Public',
  'profile.private': 'Private',
  'profile.appeal_tag': 'Appeal',
  'profile.grounds': 'Grounds:',
  'profile.checking': 'Checking your court credentials...',
  'profile.private_chambers': 'Private chambers',
  'profile.sign_in_title': 'Sign in to view your trials',
  'profile.sign_in_subtitle':
    'Your profile keeps your private, public, pending, and appealed cases in one place.',
  'profile.sign_in_button': 'Sign in with Google',
  'profile.private_profile': 'Private profile',
  'profile.reserved_slug': 'Reserved slug',
  'profile.case_files': 'Case files',
  'profile.owned_trial_singular': 'owned trial',
  'profile.owned_trial_plural': 'owned trials',
  'profile.file_new_case': 'File a new case',
  'profile.retrieving': 'Retrieving your case files...',
  'profile.no_trials': 'No trials in your chambers yet.',
  'profile.start_first': 'Start your first trial',

  // Footer
  'footer.disclaimer_1':
    'The Tribunal is a theatrical AI exercise. Not legal, medical, or professional advice.',
  'footer.disclaimer_2':
    'All verdicts are for entertainment. The court is always in session.',

  // Network / hook errors
  'errors.start_trial': 'Failed to start trial',
  'errors.network': 'Network error. Please try again.',
  'errors.file_appeal': 'Failed to file appeal',
  'errors.load_trials': 'Failed to load trials',
  'errors.trial_not_found': 'Trial not found',

  // Document metadata
  'meta.title': 'The Tribunal — Put yourself on trial.',
  'meta.description':
    'Submit a dilemma, confession, opinion, or idea. A panel of AI judges will prosecute it, defend it, and deliver a verdict.',
  'meta.og_title': 'The Tribunal — Put yourself on trial.',
  'meta.og_description':
    'A theatrical AI court. Submit a case. Get a verdict.',

  // Verdict card labels
  'verdict.card_case_number': 'Case #',
  'verdict.card_the_tribunal': 'The Tribunal',
  'verdict.card_the_case': 'The case',
  'verdict.card_charge': 'Charge',
  'verdict.card_court_recognizes': 'The court recognizes',
  'verdict.card_court_rejects': 'The court rejects',
  'verdict.card_sentence': 'Sentence',

  // Share copy text labels
  'share.copied_headline': 'THE TRIBUNAL HAS SPOKEN',
  'share.copied_case': 'Case',
  'share.copied_tribunal': 'Tribunal',
  'share.copied_verdict': 'Verdict',
  'share.copied_score': 'Score',
  'share.copied_charge': 'Charge',
  'share.copied_court_recognizes': 'The court recognizes',
  'share.copied_court_rejects': 'The court rejects',
  'share.copied_sentence': 'Sentence',
  'share.copied_tried_at': 'Tried at',

  // Tribunal display names (client-side lookup)
  'tribunal.moral.name': 'Moral Tribunal',
  'tribunal.more_info': 'More info about',
  'tribunal.relationship.name': 'Relationship Tribunal',
  'tribunal.idea.name': 'Idea Tribunal',
  'tribunal.opinion.name': 'Opinion Tribunal',
  'tribunal.roast.name': 'Roast Tribunal',
}
