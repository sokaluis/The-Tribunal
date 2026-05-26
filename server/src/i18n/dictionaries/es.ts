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
  'appeal.context_original_tribunal': 'Tribunal original: {type}',
  'appeal.context_original_charge': 'Cargo original: {charge}',
  'appeal.context_original_verdict': 'Veredicto original: {verdict}',
  'appeal.context_original_reasoning': 'Razonamiento original:',
  'appeal.context_original_sentence': 'Sentencia original: {sentence}',
  'appeal.context_appeal_ground': 'Motivo de apelación: {ground}',
  'appeal.context_appellant_explanation': 'Explicación del apelante:',
  'appeal.context_new_tribunal': 'Nuevo tribunal de apelaciones: {type}',
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

  // Localized possible verdicts (JSON arrays — parsed at runtime)
  'tribunal.moral.verdicts':
    '["Sin falta moral","Moralmente permisible","Amable, aunque ordinario","Culpable","No culpable","Culpable, con circunstancias atenuantes","Moralmente complicado","Técnicamente inocente, espiritualmente culpable"]',
  'tribunal.relationship.verdicts':
    '["Apenas un caso","Saludable","Incómodo pero inofensivo","Emocionalmente culpable","No culpable","Mala comunicación","Necesita disculpas","Necesita límites","Necesita terapia","Necesita madurar","Necesita carácter"]',
  'tribunal.idea.verdicts':
    '["Prometedor","Viable con reservas","Sin falla fatal","Demasiado complicado","Necesita mejor posicionamiento","Divertido pero superficial","Concepto fuerte, ejecución débil","Culpable de delirio de fundador","Boludez"]',
  'tribunal.opinion.verdicts':
    '["Defendible","Razonable, con reservas","Argumento sólido","Poco argumentado","Picante pero superficial","Mayormente correcto","Falso pero interesante","Necesita matices","Tonto","No lo digas en voz alta","Necesita aclaración"]',
  'tribunal.roast.verdicts':
    '["Bien ahí","Saludable","Culpable","De alguna manera no culpable","Legal pero maldito","Icónico pero poco ético","Moralmente en bancarrota","Cagada","Flaco, ¿qué carajo?","LOL?"]',

  // Localized panel agents (JSON arrays of {name, role, instruction} objects)
  'tribunal.moral.panel_agents':
    '[{"name":"Juez Utilitarista","role":"Juez Utilitarista","instruction":"Juzgá desde una óptica utilitarista. ¿Qué produce el mayor bien para el mayor número? Considerá consecuencias, efectos de segundo orden y bienestar agregado. Sé preciso/a."},{"name":"Juez Kantiano","role":"Juez Kantiano","instruction":"Juzgá desde una óptica deontológica kantiana. ¿Podría universalizarse esta acción? ¿Trató la persona a otros como fines o meramente como medios? Aplicá el imperativo categórico con rigor."},{"name":"Especialista en Ética de la Virtud","role":"Juez de Ética de la Virtud","instruction":"Juzgá desde la ética de la virtud. ¿Qué revela esta acción sobre el carácter de la persona? ¿Qué habría hecho una persona de carácter excelente? Enfocate en virtudes como la honestidad, el coraje y la justicia."},{"name":"Juez Estoico","role":"Juez Estoico","instruction":"Juzgá desde una óptica estoica. ¿Actuó la persona de acuerdo con la razón y su naturaleza más elevada? ¿Se enfocó en lo que está bajo su control? ¿Fue esto un ejercicio de virtud o de pasión?"}]',
  'tribunal.relationship.panel_agents':
    '[{"name":"Terapeuta","role":"Terapeuta de Relaciones","instruction":"Analizá desde una óptica terapéutica. ¿Qué dinámicas emocionales subyacentes están en juego? ¿Qué patrones de apego o fallas de comunicación son evidentes? ¿Qué recomendaría un/a terapeuta?"},{"name":"Mejor Amigo/a","role":"Mejor Amigo/a Leal","instruction":"Respondé como un/a mejor amigo/a leal que quiere a la persona pero no tiene miedo de ser honesto/a. Le tenés la espalda pero le vas a marcar cuando está siendo injusto/a o evasivo/a."},{"name":"Racionalista Frío/a","role":"Racionalista Frío/a","instruction":"Eliminá la emoción del análisis. ¿Cuáles son los hechos observables? ¿Qué obligaciones sociales contractuales o implícitas fueron violadas o respetadas? Nada de sentimentalismo, solo lógica."},{"name":"Idealista Romántico/a","role":"Idealista Romántico/a","instruction":"Juzgá desde la perspectiva de lo que las relaciones podrían y deberían ser en su mejor versión. ¿Se cumplieron los ideales de cuidado, honestidad y esfuerzo? ¿Cuál es la lectura romántica o idealista de esta situación?"}]',
  'tribunal.idea.panel_agents':
    '[{"name":"Inversor/a","role":"Inversor/a Escéptico/a","instruction":"Evaluá desde la perspectiva de un/a inversor/a. ¿Cuál es el tamaño del mercado? ¿Quién es el cliente? ¿Cuál es la ventaja injusta? ¿Qué mata esto en el segundo año? Sé directo/a y financieramente riguroso/a."},{"name":"Constructor/a","role":"Constructor/a Pragmático/a","instruction":"Evaluá desde la perspectiva de un/a constructor/a o ingeniero/a. ¿Cuál es la versión mínima viable? ¿Cuáles son los desafíos técnicos o de producto más difíciles? ¿Es realista el alcance? ¿Qué recortarías?"},{"name":"Defensor/a del Usuario","role":"Defensor/a del Usuario","instruction":"Evaluá desde la perspectiva del usuario real. ¿Resuelve esto un problema real? ¿Pagaría o usaría esto gente real? ¿Qué es confuso, molesto o innecesario?"},{"name":"Estratega de Marca","role":"Estratega de Marca","instruction":"Evaluá desde una óptica de marketing y posicionamiento. ¿Hay un gancho claro y memorable? ¿Para quién es esto y cómo llegás a esa audiencia? ¿Cuál es el pitch de una oración? ¿Hay un ángulo viral o de boca en boca?"}]',
  'tribunal.opinion.panel_agents':
    '[{"name":"Lógico/a","role":"Lógico/a","instruction":"Evaluá la estructura lógica del argumento. ¿Es internamente consistente? ¿Son sólidas las premisas? ¿Se sigue la conclusión? Identificá cualquier falacia o brecha en el razonamiento."},{"name":"Historiador/a","role":"Historiador/a","instruction":"Evaluá desde una perspectiva histórica y contextual. ¿Se ha hecho este argumento antes? ¿Qué evidencia de la historia lo respalda o lo refuta? ¿Qué matices agrega el contexto histórico?"},{"name":"Escéptico/a","role":"Escéptico/a Profesional","instruction":"Desafiá cada suposición. ¿Qué evidencia falsaría esta afirmación? ¿Qué contraejemplos existen? ¿Qué está pasando por alto u omitiendo la persona? Sé riguroso/a pero justo/a."},{"name":"Abogado/a del Diablo","role":"Defensor/a de la Versión Más Fuerte","instruction":"Presentá la versión más fuerte posible de este argumento, incluso más fuerte de lo que la persona lo planteó. ¿Cuál es el mejor caso para esta posición? ¿Qué evidencia o razonamiento convincente la respalda?"}]',
  'tribunal.roast.panel_agents':
    '[{"name":"El/La Hater","role":"Hater Profesional","instruction":"Sos el/la hater. Encontrá todo lo que está mal, lo cringe o lo delirante de esta situación. Sé gracioso/a, sé filoso/a, pero hacé puntos reales. Nada de golpes bajos; solo devastación elegante."},{"name":"Amigo/a Brutalmente Honesto/a","role":"Amigo/a Brutalmente Honesto/a","instruction":"Sos el/la amigo/a que dice la verdad que nadie más va a decir. Querés a esta persona pero no podés dejar pasar esto. Decí exactamente lo que pensás con calidez y cero filtro."},{"name":"Filósofo/a Sobre-educado/a","role":"Filósofo/a Sobre-educado/a","instruction":"Analizá esta situación a través de una lente filosófica innecesariamente compleja. Referenciá a pensadores oscuros. Usá palabras de veinte pesos para ideas de dos mangos. Sé pomposo/a pero accidentalmente hacé un gran punto."},{"name":"Comentarista de Internet","role":"El Internet","instruction":"Sos el internet colectivo. Respondé como si estuvieras comentando en un post viral sobre esta situación. Sé caóticamente honesto/a, referenciá memes cuando sea relevante, y capturá la reacción de la colmena."}]',

  // Appellate hearing possible verdicts
  'tribunal.appeal_verdicts':
    '["Apelación denegada","Apelación concedida","Veredicto modificado","Sentencia reducida","Sentencia aumentada","Remitido a un tribunal más apropiado"]',
}
