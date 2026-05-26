export const es: Record<string, string> = {
  // Safety messages
  'safety.crisis_message':
    'Notamos que tu caso toca algo serio, y El Tribunal no es el lugar indicado para eso. ' +
    'Si vos o alguien que conocés está pasando por un momento difícil, por favor contactá a un recurso de crisis ' +
    'o a una persona de confianza. No tenés que enfrentar esto solo/a.',
  'safety.content_policy_message':
    'El Tribunal no puede escuchar este caso. Los casos que promueven odio, violencia contra grupos, ' +
    'o contenido extremista dañino quedan fuera de lo que este tribunal juzga.',

  // Share headlines
  'share.tribunal_headline': 'EL TRIBUNAL HA HABLADO',
  'share.appellate_headline': 'EL TRIBUNAL DE APELACIONES HA HABLADO',

  // Appeal grounds
  'appeal.ground.new_context': 'Faltó contexto nuevo o evidencia en el juicio original',
  'appeal.ground.wrong_tribunal': 'El caso fue juzgado por el tipo de tribunal equivocado',
  'appeal.ground.mitigating_context_ignored': 'El tribunal original ignoró circunstancias atenuantes importantes',
  'appeal.ground.sentence_too_harsh': 'El veredicto puede ser justo, pero la sentencia fue excesiva',
  'appeal.ground.reasoning_flawed': 'El razonamiento del tribunal original fue inconsistente, injusto, o no entendió el punto',
  'appeal.ground.verdict_too_soft': 'El tribunal original fue demasiado indulgente',

  // Appeal context formatting
  'appeal.context_header':
    'Esta es una AUDIENCIA DE APELACIÓN. El caso ya fue juzgado y se emitió un veredicto. ' +
    'Un nuevo tribunal está revisando el fallo original en apelación.',
  'appeal.context_original_tribunal': 'Tribunal original: {type} Tribunal',
  'appeal.context_original_charge': 'Cargo original: {charge}',
  'appeal.context_original_verdict': 'Veredicto original: {verdict}',
  'appeal.context_original_reasoning': 'Razonamiento original:',
  'appeal.context_original_sentence': 'Sentencia original: {sentence}',
  'appeal.context_appeal_ground': 'Motivo de apelación: {ground}',
  'appeal.context_appellant_explanation': 'Explicación del apelante:',
  'appeal.context_new_tribunal': 'Nuevo tribunal de apelaciones: {type} Tribunal',
  'appeal.context_section_header': 'CONTEXTO DE APELACIÓN',

  // Trial response labels
  'trial.prosecution_title': 'El caso en tu contra',
  'trial.defense_title': 'La mejor defensa',
  'trial.error_message': 'Algo salió mal durante el juicio. Por favor intentá de nuevo.',
  'trial.safety_default': 'Este caso no pudo ser procesado.',

  // Prompt fragments
  'prompt.language_instruction':
    'Debés responder completamente en {language}. ' +
    'Todo el resultado — veredictos, argumentos, razonamientos, sentencias, resúmenes, titulares, ' +
    'cargos, principios clave, reconocido, rechazado — debe estar en {language}.',

  // Tribunal display data
  'tribunal.moral.name': 'Tribunal Moral',
  'tribunal.moral.description': 'Juzga decisiones éticas usando marcos filosóficos.',
  'tribunal.moral.tone': 'filosófico, riguroso, ligeramente solemne',
  'tribunal.moral.score_label': 'Inmoralidad',

  'tribunal.relationship.name': 'Tribunal de Relaciones',
  'tribunal.relationship.description': 'Juzga comportamiento interpersonal, comunicación y responsabilidad emocional.',
  'tribunal.relationship.tone': 'empático pero directo, emocionalmente inteligente, ocasionalmente irónico',
  'tribunal.relationship.score_label': 'Forro',

  'tribunal.idea.name': 'Tribunal de Ideas',
  'tribunal.idea.description': 'Juzga ideas de startups, conceptos creativos e ideas de productos.',
  'tribunal.idea.tone': 'incisivo, constructivo, ocasionalmente salvaje',
  'tribunal.idea.score_label': 'Boludez',

  'tribunal.opinion.name': 'Tribunal de Opiniones',
  'tribunal.opinion.description': 'Juzga opiniones fuertes, argumentos, creencias y puntos de vista.',
  'tribunal.opinion.tone': 'intelectualmente riguroso, afilado, ocasionalmente socrático',
  'tribunal.opinion.score_label': 'Debilidad argumental',

  'tribunal.roast.name': 'Tribunal de la Cachada',
  'tribunal.roast.description': 'Un tribunal más duro y cómico. Sigue siendo perspicaz, pero más brutal.',
  'tribunal.roast.tone': 'cómico, afilado, brutalmente honesto, teatral',
  'tribunal.roast.score_label': 'Vergüenza',
}
