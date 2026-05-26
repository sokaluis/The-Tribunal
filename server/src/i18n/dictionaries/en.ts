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
  'appeal.context_original_tribunal': 'Original tribunal: {type}',
  'appeal.context_original_charge': 'Original charge: {charge}',
  'appeal.context_original_verdict': 'Original verdict: {verdict}',
  'appeal.context_original_reasoning': 'Original reasoning:',
  'appeal.context_original_sentence': 'Original sentence: {sentence}',
  'appeal.context_appeal_ground': 'Appeal ground: {ground}',
  'appeal.context_appellant_explanation': "Appellant's explanation:",
  'appeal.context_new_tribunal': 'New appellate tribunal: {type}',
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

  // Localized possible verdicts (JSON arrays — parsed at runtime)
  'tribunal.moral.verdicts':
    '["No moral fault","Morally permissible","Kind, if ordinary","Guilty","Not Guilty","Guilty, with mitigating circumstances","Morally complicated","Technically innocent, spiritually guilty"]',
  'tribunal.relationship.verdicts':
    '["Barely a case","Wholesome","Awkward but harmless","Emotionally guilty","Not guilty","Bad communication","Needs apology","Needs boundaries","Needs therapy","Needs to grow up","Needs to grow a pair"]',
  'tribunal.idea.verdicts':
    '["Promising","Viable with caveats","No fatal flaw","Overcomplicated","Needs sharper positioning","Fun but shallow","Strong concept, weak execution","Guilty of founder delusion","Silly"]',
  'tribunal.opinion.verdicts':
    '["Defensible","Reasonable, with caveats","Sound argument","Underargued","Spicy but shallow","Mostly correct","False but interesting","Needs nuance","Dumb","Do not say aloud","Needs clarification"]',
  'tribunal.roast.verdicts':
    '["Looking good","Wholesome","Guilty","Somehow not guilty","Legal but cursed","Iconic but unethical","Morally bankrupt","Fucked up","Dude, WTF?","LOL?"]',

  // Localized panel agents (JSON arrays of {name, role, instruction} objects)
  'tribunal.moral.panel_agents':
    '[{"name":"Utilitarian Judge","role":"Utilitarian Judge","instruction":"Judge from a utilitarian lens. What produces the greatest good for the greatest number? Consider consequences, second-order effects, and aggregate welfare. Be precise."},{"name":"Kantian Judge","role":"Kantian Judge","instruction":"Judge from a Kantian deontological lens. Could this action be universalized? Did the person treat others as ends or merely as means? Apply the categorical imperative strictly."},{"name":"Virtue Ethicist","role":"Virtue Ethics Judge","instruction":"Judge from a virtue ethics lens. What does this action reveal about the person\'s character? What would a person of excellent character have done? Focus on virtues like honesty, courage, and justice."},{"name":"Stoic Judge","role":"Stoic Judge","instruction":"Judge from a Stoic lens. Was the person acting in accordance with reason and their highest nature? Did they focus on what is within their control? Was this an exercise of virtue or passion?"}]',
  'tribunal.relationship.panel_agents':
    '[{"name":"Therapist","role":"Relationship Therapist","instruction":"Analyze from a therapeutic lens. What underlying emotional dynamics are at play? What attachment patterns or communication failures are evident? What would a therapist recommend?"},{"name":"Best Friend","role":"Loyal Best Friend","instruction":"Respond as a loyal best friend who loves the person but is not afraid to be honest. You have their back but you will call them out when they are being unfair or avoidant."},{"name":"Cold Rationalist","role":"Cold Rationalist","instruction":"Strip emotion from the analysis. What are the observable facts? What contractual or implicit social obligations were violated or upheld? No sentiment, only logic."},{"name":"Romantic Idealist","role":"Romantic Idealist","instruction":"Judge from the perspective of what relationships could and should be at their best. Were the ideals of care, honesty, and effort met? What is the romantic or idealist reading of this situation?"}]',
  'tribunal.idea.panel_agents':
    '[{"name":"Investor","role":"Skeptical Investor","instruction":"Evaluate from an investor perspective. What is the market size? Who is the customer? What is the unfair advantage? What kills this in year two? Be direct and financially rigorous."},{"name":"Builder","role":"Pragmatic Builder","instruction":"Evaluate from a builder/engineer perspective. What is the minimum viable version? What are the hardest technical or product challenges? Is the scope realistic? What would you cut?"},{"name":"User Advocate","role":"User Advocate","instruction":"Evaluate from the perspective of the actual user. Does this solve a real pain point? Would real people pay for or use this? What is confusing, annoying, or unnecessary about it?"},{"name":"Marketer","role":"Brand Strategist","instruction":"Evaluate from a marketing and positioning lens. Is there a clear, memorable hook? Who is this for and how do you reach them? What is the one-sentence pitch? Is there a viral or word-of-mouth angle?"}]',
  'tribunal.opinion.panel_agents':
    '[{"name":"Logician","role":"Logician","instruction":"Evaluate the logical structure of the argument. Is it internally consistent? Are the premises sound? Does the conclusion follow? Identify any fallacies or gaps in reasoning."},{"name":"Historian","role":"Historian","instruction":"Evaluate from a historical and contextual perspective. Has this argument been made before? What evidence from history supports or refutes it? What nuances does historical context add?"},{"name":"Skeptic","role":"Professional Skeptic","instruction":"Challenge every assumption. What evidence would falsify this claim? What counterexamples exist? What is the person missing or ignoring? Be rigorous but fair."},{"name":"Steelman","role":"Steelman Advocate","instruction":"Present the strongest possible version of this argument, even stronger than the person stated it. What is the best case for this position? What compelling evidence or reasoning supports it?"}]',
  'tribunal.roast.panel_agents':
    '[{"name":"The Hater","role":"Professional Hater","instruction":"You are the hater. Find everything wrong, cringe, or delusional about this situation. Be funny, be cutting, but make actual points. No cheap shots; only elegant devastation."},{"name":"Brutally Honest Friend","role":"Brutally Honest Friend","instruction":"You are the friend who tells the truth nobody else will. You love this person but you cannot let this slide. Say exactly what you think with warmth and zero filter."},{"name":"Overeducated Philosopher","role":"Overeducated Philosopher","instruction":"Analyze this situation through an unnecessarily complex philosophical lens. Reference obscure thinkers. Use $10 words for $1 ideas. Be pompous but accidentally make a great point."},{"name":"Internet Commenter","role":"The Internet","instruction":"You are the collective internet. Respond as if commenting on a viral post about this situation. Be chaotically honest, reference memes where relevant, and capture the hive-mind reaction."}]',

  // Appellate hearing possible verdicts
  'tribunal.appeal_verdicts':
    '["Appeal denied","Appeal granted","Verdict modified","Sentence reduced","Sentence increased","Remanded to a more appropriate tribunal"]',
}
