export const en: Record<string, string> = {
  // Safety messages
  'safety.crisis_message':
    "We noticed your submission touches on something serious, and The Tribunal is not the right place for it. " +
    "If you or someone you know is struggling, please reach out to a crisis resource or trusted person. " +
    "You don't have to face this alone.",
  'safety.content_policy_message':
    "The Tribunal can't hear this case. Submissions that promote hatred, violence against groups, " +
    "or harmful extremist content fall outside what this court adjudicates.",

  // Share headlines
  'share.tribunal_headline': 'THE TRIBUNAL HAS SPOKEN',
  'share.appellate_headline': 'THE APPELLATE TRIBUNAL HAS SPOKEN',

  // Appeal grounds (labels shown in prompt context and UI)
  'appeal.ground.new_context': 'New context or evidence was missing from the original trial',
  'appeal.ground.wrong_tribunal': 'The case was judged by the wrong kind of tribunal',
  'appeal.ground.mitigating_context_ignored': 'The original court ignored important mitigating circumstances',
  'appeal.ground.sentence_too_harsh': 'The verdict may be fair, but the sentence was excessive',
  'appeal.ground.reasoning_flawed': "The original court's reasoning was inconsistent, unfair, or missed the point",
  'appeal.ground.verdict_too_soft': 'The original court was too lenient',

  // Appeal context formatting (inserted into LLM prompts)
  'appeal.context_header':
    'This is an APPELLATE HEARING. The case was previously tried and a verdict was rendered. ' +
    'A new court is now reviewing the original ruling on appeal.',
  'appeal.context_original_tribunal': 'Original tribunal: {type} Tribunal',
  'appeal.context_original_charge': 'Original charge: {charge}',
  'appeal.context_original_verdict': 'Original verdict: {verdict}',
  'appeal.context_original_reasoning': 'Original reasoning:',
  'appeal.context_original_sentence': 'Original sentence: {sentence}',
  'appeal.context_appeal_ground': 'Appeal ground: {ground}',
  'appeal.context_appellant_explanation': "Appellant's explanation:",
  'appeal.context_new_tribunal': 'New appellate tribunal: {type} Tribunal',
  'appeal.context_section_header': 'APPEAL CONTEXT',

  // Trial response labels (API response — Phase 5 will add locale to responses)
  'trial.prosecution_title': 'The case against you',
  'trial.defense_title': 'The best defense',
  'trial.error_message': 'Something went wrong during the trial. Please try again.',
  'trial.safety_default': 'This submission could not be processed.',

  // Prompt fragments
  'prompt.language_instruction':
    'You must respond entirely in {language}. ' +
    'All output — verdicts, arguments, reasoning, sentences, summaries, headlines, ' +
    'charges, key principles, recognized, rejected — must be in {language}.',

  // Tribunal display data
  'tribunal.moral.name': 'Moral Tribunal',
  'tribunal.moral.description': 'Judges ethical choices using philosophical frameworks.',
  'tribunal.moral.tone': 'philosophical, rigorous, slightly solemn',
  'tribunal.moral.score_label': 'Immorality',

  'tribunal.relationship.name': 'Relationship Tribunal',
  'tribunal.relationship.description': 'Judges interpersonal behavior, communication, and emotional responsibility.',
  'tribunal.relationship.tone': 'empathetic but direct, emotionally intelligent, occasionally wry',
  'tribunal.relationship.score_label': 'Asshole',

  'tribunal.idea.name': 'Idea Tribunal',
  'tribunal.idea.description': 'Judges startup ideas, creative concepts, and product ideas.',
  'tribunal.idea.tone': 'incisive, constructive, occasionally savage',
  'tribunal.idea.score_label': 'Silly',

  'tribunal.opinion.name': 'Opinion Tribunal',
  'tribunal.opinion.description': 'Judges hot takes, arguments, beliefs, and opinions.',
  'tribunal.opinion.tone': 'intellectually rigorous, sharp, occasionally Socratic',
  'tribunal.opinion.score_label': 'Argument weakness',

  'tribunal.roast.name': 'Roast Tribunal',
  'tribunal.roast.description': 'A harsher, more comedic court. Still insightful, but more brutal.',
  'tribunal.roast.tone': 'comedic, sharp, brutally honest, theatrical',
  'tribunal.roast.score_label': 'Cringe',
}
