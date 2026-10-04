# Introdução e boas práticas em UX Design

Casa do
Código

FABRICIO TEIXEIRA

---

© Casa do Código

Todos os direitos reservados e protegidos pela Lei nº9.610, de
10/02/1998.

Nenhuma parte deste livro poderá ser reproduzida, nem transmitida, sem
autorização prévia por escrito da editora, sejam quais forem os meios:
fotográficos, eletrônicos, mecânicos, gravação ou quaisquer outros.

Casa do Código

Livros para o programador

Rua Vergueiro, 3185 - 8º andar

04101-300 – Vila Mariana – São Paulo – SP – Brasil

---

## Prefacio

Por que produtos ou serviços digitais similares fazem mais sucesso do que outros? Um fator de peso está na relação entre o usuário e o produto. Nesse mundo conectado em que vivemos, cada vez mais ganha força o que considero antropocentrismo digital: o usuário é o rei. Se ele não tem uma boa experiência com o produto digital, ele deixa de utilizá-lo e migra para interfaces mais inteligentes, agradáveis e de fácil uso. E o diferencial do produto ou serviço digital pode residir justamente ali.

Se você trabalha com algum produto o (website, mobile app) para comunicar-se co gatório em sua biblioteca - mesmo que virtu

serviço digital, ou usa o digital m seu público, esse livro é obri al.

Não temos tempo para ler manuais – seguimos padrões cognitivos de navegação cada vez mais intuitivos. Um sistema pode ser extraordinário em termos da complexidade de desenvolvimento, otimização no processamento computacional ou das integrações com N outros sistemas online. Se aquela camada do software que faz a interface com o usuário não é agradavelmente usável, o resultado de todo o seu incrível trabalho tecnológico de bastidores pode ter sido em vão ou negativamente impactado, pois não atingiu quem deveria: o usuário final.

Se o profissional de UX já faz parte de sua vida como desenvolvedor e você acha que o entregável dele restringe-se a wireframes, você verá nesse livro que existe muito mais ciência no seu trabalho, explorando o user journey, user stories, blueprint, passando por personas e mapeamento do ecossistema.

Existe muito trabalho intelectual de pesquisa de um bom UX Designer e de questionamento constante: essa solução de interface é a que melhor materializa uma boa experiência para o usuário desse produto? Ou ainda: dentro do prazo que temos, quais funcionalidades devem ser priorizadas?

Dentro da Computação existe uma disciplina que às vezes aparece na grade curricular um pouco perdida ou até mesmo negligenciada, que é a HCI ou IHC (Interação Homem-Computador). Ela demonstra que a preocupação com o usuário não é privilégio do mundo digital, da internet: as primeiras publicações datam da década de 70. É interessante também observar como metodologias que passam pela área do desenvolvimento, como Agile ou Lean Design, são naturalmente transportadas para o mundo UX. Esses são apenas exemplos para comprovar o quanto o UX tem uma grande afinidade com a Computação.

Creio que seja por isso que, desde o início de minha carreira em desenvolvimento web, encontrei nesse profissional - que na época era chamado apenas de arquiteto de informação - um elo de ligação entre o desenvolvimento que é vinculado à tecnologia e à concepção do site atrelado àcriação. Era o profissional da área de criação que tinha um pensamento mais próximo ao meu, pendendo para o lógico e estruturado.

O nome "arquiteto de informação" foi pessoalmente importante para que pudesse entender o seu papel e sua relação com o meu trabalho: ambos está-vamos construindo uma casa, um edifício ou um "sítio". A ele, como arquiteto, cabia definir quais cômodos teria na casa e suas disposições para que a pessoa que fosse visitá-la tivesse a sensação de que era funcional e agradável. A mim, como programador – ou engenheiro –, construir o alicerce, levantar as vigas, as paredes, a laje e todo o necessário para dar vida ao projeto. Tecnicamente, é possível um engenheiro construir uma casa sem um arquiteto? Sim. Ela tem chance de ser extraordinária e única do ponto de vista estético? Dificil. Mas isso não quer dizer que o engenheiro não possa entender um pouco do mundo do arquiteto, até por estarem tão conectados pelo produto final.

Tive a sorte de encontrar pelo meu caminho bons profissionais que entendiam que, para fazer bem o seu trabalho, precisavam do input de outras pessoas - inclusive dos programadores - em um processo de trabalho mais colaborativo.

O autor desse livro é quem melhor personifica para mim a competência nessa matéria, tanto por ser um estudioso incansável de novas metodologias relacionadas à evolução da disciplina em si, quanto pelo papel que sem- preexercenosprojetosemquetrabalha:apreocupaçãocomousuáriofinal
ecomaspessoasquetrabalhamnesseprocesso,incentivando-asafazeros
mesmosquestionamentossobreusabilidadee,consequentemente,construindoummelhorprodutofinal. Oimportanteparaelenãoéapenasofim,
masoprocessoparachegarlá,quepodeserigualmenterecompensador.Ou
atémais.Compartilhamosdessacrença.

Compartilharoconhecimentofazpartedavidadoautor,sejanoblogque
mantém(http://arquiteturadeinformacao.com),nesseprópriolivroeatéem
sualistadelugaresparavisitarnoFoursquare. Sevocêumdiaquiserdicas
doquefazeremNYC,porexemplo,procureousuáriodelenessaredesocial,
queencontraráumalistadevidamentecategorizadaporassunto.

Nocapitulointrodutório,Fabriciosabiamenteprocuraalinharasexpectativasdevocê,leitor,(jáéumaamostradecomoelesepreocupoucomasua
experiênciaaolerolivro)efazumconviteparatrilharcomeleajornadado
UXDesign,quenãoacabanesselivro.Reforçoesseconvite,poisvocênãovai
searrependerdeexploraressemundoqueestáemconstanteevolução.Enão
sesurpreendaseaochegaraofinaldolivrovocêsesentirtentadoainvestigar
maisoassunto:éissoquefazemosbonslivros.

## Sobre Edson Sueyoshi

EdsonSueyoshi,éSeniorTechnologyDirectordaR/GAdeSãoPaulo,
trabalhouemportaisdeconteúdocomoUOLeGlobo.comeagênciade
publicidadedigitalcomoAgênciaClickdesenvolvendoprojetosdigitais
comositeseaplicativosparaclientescomoCoca-Cola,FIAT,ESPN,Sadia, Citibank, MasterCard, TIMeGoogle. Jáprogramouemdiversas
linguagenscomoJava,.Net,Perl,PHPeRubyenosetupdeinfraestruturadeservidoreswebedeaplicação.Seumaiorinteresseprofissionalé
exploraratecnologianocontextodaComunicaçãoePublicidade.

---



---

## Sobreoautor

FabricioTeixeiratrabalhacom **UserExperienceDesign** háváriosanos,desenhandoprodutosecampanhasdigitaisparagrandesmarcascomoGoogle,
YouTube,Metlife,Fiat,ESPN,Petrobras–entreoutras.GraduadoemPublicidadeePropagandaepós-graduadoemMídiasInterativas,tempassagenspor
agênciasdepublicidadedigitalcomoAgênciaClick,CrispinPorter+Bogusky
eR/GA,tantonoBrasilquantonosEUA.JáfoiprofessordeUserExperiencenaMiamiAdSchool/ESPMeparticipoucomopalestrantedeeventosde
grandeporterelacionadosàdisciplina.Entreosprêmiosacumuladosdurante
acarreiraconstamCannesLions,OneShowInteractive,WaveFestivaleiMasters. TambémcolaboraparaoUpdateorDie,umcoletivonão-jornalístico
comprofissionaisdeváriasdisciplinasqueestimulamoaprendizadoeacriatividadeonline,alémdemanterumdosmaioresblogssobreUserExperience
eArquiteturadeInformaçãodoBrasil(http://arquiteturadeinformacao.com)
. AtualmenteédiretordeUserExperiencenoescritóriodaR/GAemNova
Iorque.

---



---

## Agradecimentos

ÀCasadoCódigo,peloextremocuidadoeapoiocomapublicaçãodolivro.

Aos designers, criadores e amigos Caio Braga, Lilian Rousseau, Peter
Pawlick, Colby Dennison, Jonathan LaCour, Pon Kattera, Mauricio Melo,
AgathaKimeElisaVolpato,pelascontribuiçõesemotivaçãoantesedurante
oprocesso.

AoamigoEdsonSueyoshi,queescreveuoprefácio.

Àminhafamília,porsempreincentivaraescrita–entreoutrasformasde
expressão–emminhavida.

---



---

## Do que trata o livro

UX Design – Introdução e boas práticas no Design da Experiência do Usuário é uma coletânea de artigos sobre User Experience Design para quem trabalha com design e desenvolvimento de produtos digitais - seja em portais, agências de publicidade, startups, consultorias ou empresas que de alguma forma estejam envolvidas com criação de software.

Com as interfaces digitais dominando cada vez mais os novos aspectos de nossas rotinas, aumenta também a procura por profissionais especializados em Design da Experiência do Usuário (UX Design) para garantir que esses produtos sejam, acima de tudo, fáceis e agradáveis de usar. Em um mercado cada vez mais competitivo, diferenciam-se os produtos e empresas que colocam o usuário no centro do processo de Design, envolvendo-os desde as etapas de estratégia e concepção até as etapas de desenvolvimento e testes.

Nos últimos anos tenho procurado colaborar com a comunidade de designers e desenvolvores brasileiros através de meu blog (http:// arquiteturadeinformacao.com) , onde compartilho artigos, links e reflexões relacionados a UX Design. Ainda assim, muita gente entra em contato comigo procurando saber mais sobre a disciplina, mencionando a dificuldade em encontrar textos em português sobre o assunto. Um dos objetivos deste livro é disseminar informação sobre UX Design por novos canais, de forma didática, simples e centralizada.

---



---

## Sumário

**1 OqueéUserExperience 1**
1.1 AsdisciplinasdeUX. . . . . . . . . . . . . . . . . . . . . . . . 3
1.2 OquefazumUXdesigner. . . . . . . . . . . . . . . . . . . . 6
1.3 QualquerumpodeserUXdesigner . . . . . . . . . . . . . . . 8
1.4 AsdiferentesfacesdoUXdesigner. . . . . . . . . . . . . . . 9
1.5 OqueUXDesignnãoé . . . . . . . . . . . . . . . . . . . . . . 12
1.6 DesenvolvedorestambémsãoUXdesigners . . . . . . . . . . 12
**2 MétodoseentregáveisdeUX 17**
2.1 Definiçãodaestratégia. . . . . . . . . . . . . . . . . . . . . . 18
2.2 Geraçãodeideias. . . . . . . . . . . . . . . . . . . . . . . . . 26
2.3 Planejamentodoproduto . . . . . . . . . . . . . . . . . . . . . 29
2.4 Pesquisaevalidação . . . . . . . . . . . . . . . . . . . . . . . . 33
2.5 Desenhodeinterfaces . . . . . . . . . . . . . . . . . . . . . . . 36
**3 Wireframes,protótiposerabiscoframes 41**
3.1 Comonascemoswireframes . . . . . . . . . . . . . . . . . . . 44
3.2 Comointerpretarumwireframe . . . . . . . . . . . . . . . . . 46
3.3 Asvantagensdeusarwireframesnoprocesso. . . . . . . . . 50
3.4 Alternativasaoswireframes. . . . . . . . . . . . . . . . . . . 51
3.5 Asvantagensdosprotótipos. . . . . . . . . . . . . . . . . . . 56
3.6 Comodecidirentreprotótiposewireframes . . . . . . . . . . 59
3.7 Comunicandoideiascomrabiscoframes. . . . . . . . . . . . 63
3.8 Boaspráticaspararabiscar. . . . . . . . . . . . . . . . . . . . 65

---

**4 Aboaevelhausabilidade 69**
4.1 Simplicidadenãoésimples . . . . . . . . . . . . . . . . . . . . 70
4.2 Ofereçainformaçõesempequenasdoses . . . . . . . . . . . . 72
4.3 Criehierarquianapágina . . . . . . . . . . . . . . . . . . . . . 75
4.4 Digaaousuáriooquefazeraseguir . . . . . . . . . . . . . . . 80
4.5 Dêfeedbacksobreoestadodosistema. . . . . . . . . . . . . 83
4.6 Eviteerrosantesqueaconteçam . . . . . . . . . . . . . . . . . 84
4.7 Simplifiqueformulários . . . . . . . . . . . . . . . . . . . . . . 88
**5 Abelezadospequenosdetalhes 93**
5.1 Eviteelementosemexcesso . . . . . . . . . . . . . . . . . . . . 97
5.2 Reveleinformaçõesprogressivamente. . . . . . . . . . . . . 98
5.3 Sejacuidadosocomotempodousuário. . . . . . . . . . . . 99
5.4 Crieexperiênciaspersonalizadas. . . . . . . . . . . . . . . . 101
5.5 Adivinheaintençãodousuário. . . . . . . . . . . . . . . . . 102
5.6 Façaotrabalhopesado. . . . . . . . . . . . . . . . . . . . . . 105
5.7 Sejahonestocomseuspedidos . . . . . . . . . . . . . . . . . . 106
5.8 Expresseapersonalidadedasuamarca . . . . . . . . . . . . . 107
**6 Aimportânciadosmicrotextos 111**
6.1 Ovalorfuncionaldosmicrotextos . . . . . . . . . . . . . . . . 113
6.2 Ovaloremocionaldosmicrotextos. . . . . . . . . . . . . . . 116
6.3 Comuniquebenefícios,nãofuncionalidades . . . . . . . . . . 117
6.4 Falealinguagemdosseususuários. . . . . . . . . . . . . . . 118
6.5 Mantenhaostextoscurtos. . . . . . . . . . . . . . . . . . . . 119
**7 Construindoumabibliotecadepadrões 121**
7.1 Asvantagensemterumabiblioteca . . . . . . . . . . . . . . . 124
7.2 Abibliotecacomoentregávelfinaldoprojeto. . . . . . . . . 126
7.3 Maispadronizaçãonãosignificamenoscriatividade. . . . . 128
xii

---

**8 Testandocomusuários 131**
8.1 Saiadasuamesacommaisfrequência. . . . . . . . . . . . . 133
8.2 Testesdeusabilidade. . . . . . . . . . . . . . . . . . . . . . . 135
8.3 Desculpascomunsparanãotestarcomusuários. . . . . . . 138
8.4 Incorporandopesquisacomusuáriosemseuprojeto . . . . . 140
8.5 Osnúmerosnãomentem . . . . . . . . . . . . . . . . . . . . . 144
8.6 TestesA/B . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 145
**9 Ospecadosdeusabilidade 147**
9.1 Comoprevenirerrosdeusabilidade . . . . . . . . . . . . . . . 150
9.2 Opçõesdemais,opçõesdemenos. . . . . . . . . . . . . . . . 152
9.3 Osgatilhosinvisíveis. . . . . . . . . . . . . . . . . . . . . . . 153
**10 Negligenciandoaperformancedaspáginas 157**
10.1 Oimpactodaperformancedaspáginas . . . . . . . . . . . . . 158
10.2 Umabatalhademuitasfrentes . . . . . . . . . . . . . . . . . . 159
10.3 Otimizandoaperformance . . . . . . . . . . . . . . . . . . . . 161
**11 Produtosqueninguémusa 165**
11.1 Começandopelousuário. . . . . . . . . . . . . . . . . . . . . 166
11.2 Escolhendoumatecnologia. . . . . . . . . . . . . . . . . . . 167
11.3 Definindoaproposiçãodevalordoproduto . . . . . . . . . . 170
**12 Priorizandofuncionalidades 175**
12.1 Oeternoproblemadoescopoedoprazo . . . . . . . . . . . . 175
12.2 Aestratégiadoscupcakes . . . . . . . . . . . . . . . . . . . . . 177
12.3 Priorizandoasfeaturesdeumproduto. . . . . . . . . . . . . 179
12.4 Umprodutonuncaestápronto. . . . . . . . . . . . . . . . . 182
**13 ChecklistdeUX 185**
13.1 Simples. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 186
13.2 Acionável. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 187
13.3 Inteligente . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 187
13.4 Agradável . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 188
13.5 Relevante. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 189

---

**14 UXnomundodosnegócios 191**
14.1 Design=Dinheiro . . . . . . . . . . . . . . . . . . . . . . . . . 192
14.2 ConvencendootimeainvestiremUX. . . . . . . . . . . . . 192
**15 ComocomeçaremUXDesign 195**
15.1 OmercadodeUXnoBrasil. . . . . . . . . . . . . . . . . . . 196
15.2 Ondetrabalhar . . . . . . . . . . . . . . . . . . . . . . . . . . . 197
15.3 Comoconseguirumempregonaárea. . . . . . . . . . . . . . 197
15.4 ComoseconectarcomprofissionaisdeUX. . . . . . . . . . 199
15.5 Comosemanteratualizado. . . . . . . . . . . . . . . . . . . . 200
15.6 Comoaprenderausarasferramentas . . . . . . . . . . . . . . 203
15.7 MasporquetrabalharcomUX. . . . . . . . . . . . . . . . . 203
**16 Ofuturodaexperiênciadousuário 207**
**17 Bibliografia 209**

---

Capítulo 1

# OqueéUserExperience

ApesardoestrangeirismoquedeuorigemàsiglaUX(User *eXperience),* o
termoébemmaissimplesdoqueparece.Experiênciadousuário.Experiência
dequemusa.

Nodecorrerdodianostornamos“usuários”deumaporçãodecoisas.
Oalarmedocelularquenosacordademanhã, acadeira, ocarro, ocontroleremotodoarcondicionado,oFacebook,ostalheres,ocaixaeletrônico,o
computadornotrabalho,ocopodecerveja–objetoseprodutos,digitaisou
não,quesão“usados”porpessoasequesãoprojetadosparacumpriralguma
função. Oalarmeparanosacordar,ocaixaeletrônicoparafazertransações
financeiras,acadeiraparadescansar.

Quandovocêusaalgumdessesobjetos,vocêtemumaexperiência. Se
vocêjápassounervosonafrentedocaixaeletrônicoporqueelenãoentregou
odinheiroquevocêestavaesperandoenãodeunenhumaexplicaçãosensata sobre o motivo da recusa, você possivelmente teve uma pessima experiência enquanto usuário do caixa eletrônico.

Experiência do usuário existe desde que o mundo é mundo. Ou melhor, desde que as pessoas começaram a "usar" objetos para realizar alguma tarefa.

Depois, vieram produtos digitais. Websites, aplicativos de celular, caixas eletrônicos, quiosques interativos, tablets, TVs digitais, videogames. O princípio continuou o mesmo: a experiência de usar um site, por exemplo, pode ser positiva ou negativa, dependendo do seu fluxo dentro dele. Normalmente, a experiência é positiva quando você consegue realizar a tarefa sem demora, frustração ou sem encontrar problemas no meio do caminho. Essa tarefa pode ser tanto funcional (entrar no seu internet banking para pagar um boleto bancário) ou emocional (entrar no site de uma rede social para saber o que seus amigos andam fazendo).

Experiências são, obviamente, subjetivas. Cada pessoa tem uma experiência diferente ao usar um caixa eletrônico, por exemplo. Essa experiência é influenciada por fatores humanos (sua habilidade em usar caixas eletrônicos, sua visão, sua habilidade motora, sua capacidade de ler e entender o que está escrito na tela, seu humor naquele momento etc.) e por fatores externos (o horário do dia, o ambiente onde o caixa eletrônico está instalado, o fato de ter uma fila de pessoas atrás de você). Mas, apesar de subjetivas, essas experiências são projetadas por alguém. Alguem pensou e desenhou a interface digital do caixa eletrônico para que os clientes do banco pudessem fazer transações sem precisar da interface humana. É a tal "interação homem-máquina" (HCI — Human-Computer Interaction), um campo de estudo grandiosissimo que mobiliza profissionais de vários perfis ao redor do mundo.

"A maioria das pessoas acredita que User Experience é somente encontrar a melhor solução para os seus usuários – mas não é. UX se trata sobre definir o problema que precisa ser resolvido (o porque), definir para quem esse problema precisa ser resolvido (o quem), e definir o caminho que deve ser percorrido para resolve-lo (o como)."

- Whitney Hess

---

## 1.1 As disciplinas de UX

USER EXPERIENCE DESIGN

INFORMATION
ARCHITECTURE

ARCHITECTURE

Content
(Text, Video,
Sound)

INDUSTRIAL
DESIGN

HUMAN
FACTORS

VISUAL
DESIGN

INTERACTION DESIGN

SOUND
DESIGN

HUMAN-COMPUTER
INTERACTION

Figura1.1:DiagramadasdisciplinasquecompõemUserExperience

DanSaffer,designerdeinteraçãoeautordolivroDesigningforInteraction
(http://www.designingforinteraction.com) , construiu um diagrama há algunsanosquedefinebemasintersecçõesenomenclaturasdadisciplina.

ReparecomoograndecírculodeUserExperienceDesignenglobauma sériedeoutrasdisciplinas:deArquiteturadeInformaçãoaDesignIndustrial,
passandoatéporSoundDesign.Sim,aquelesonzinhoquetocaquandovocê
iniciaseuPCouMactambémfazpartedaexperiênciadousuário. E,como
todoelementodaexperiênciadousuário,tambémfoiprojetadoporalguém.

UmaoutraformainteressantedeilustraroqueéUserExperienceDesign
vemdeStephenAnderson,autordolivroSeductiveInteractionDesign(http:
//www.goodreads.com/book/show/9967766-seductive-interaction-design).

AUMENTAR
A MOTIVAÇÃO
(PSICOLOGIA)
REDUZIR
A FRICÇÃO
(USABILIDADE)

UXdesignerstrabalhamparaconstruirprodutosquesejamfáceisdeusar
(atal usabilidade),reduzindoafricçãoepermitindoqueosusuárioscompletematarefadesejadaemmenostempo,commenosruídoeobstáculos.Ao
mesmotempo,apoiam-seemprincípiosda **psicologia** paramotivarousuário
eincentivá-loaseguiradiante.

Vocêjádevetertidoaexperiênciadeficarhorasjogandoummesmojogo,
sejanovideogame,nocelularounocomputador. Osjogossãoexperiências
queconseguemequilibrarmuitobemessesdoisaspectos.

---

Normalmente,lk./asprimeirasfasesdeumjogosãopropositalmentesimplificadasparafazerousuárioseengajarcomele:amecânicaeoscontrolesdo
jogosãoexplicados(usabilidade)eváriastécnicasmotivacionaissãousadas
parafazercomqueojogadorsesintaconfianteemsuasprópriashabilidades
(psicologia).

Plop those tomato seeds in the empty plots now.

Figura1.2:“Parabéns,vocêcolheuseuprimeirotomate!

A mesma regra se aplica para os projetos nos quais você trabalha, sejamelesjogos,websites,aplicativosparacelular,serviçosdigitais,sitesdeecommerceetc. Comofazeroseuusuáriocompletarastarefassemdificuldades?Comocriarumainterfacequesejarealmentesimplesdeusar?Como
manterousuáriomotivadoparaseguiradiante,parapassarmaistempousandooseuproduto,paradivulgaroseuprodutoparaosamigosouparavoltar
maisvezesaele?

---

## 1.2 O QUE FAZ UM UX DESIGNER

Se você trabalha em agência de publicidade, portal, startup, consultoria ou produtora digital, ou qualquer empresa que esteja de alguma forma envolvida em desenvolvimento de software, você já deve ter esbarrado com um UX designer em algum lugar. Seja em um manual de boas práticas para construir sites, seja em uma conferência internacional dos publicitários que voam de primeira classe ou seja aquele fulano de job description nebuloso que está sentado na mesma sala de reunião que você.

Mas apesar de o nome da profissão conter a palavra "designer", esses profissionais não necessariamente usam o Photoshop para criar a aparência final do produto que será visto pelas pessoas. Como projetistas da experiência do usuário, o mais importante para os UX designers é definir como as pessoas irão interagir com o produto, quais tarefas conseguirão realizar dentro dele, qual a ordem na qual as telas serão apresentadas – e por aí vai. Normalmente, existe uma etapa seguinte ao trabalho do UX designer onde um diretor de arte faz com que a interface tome forma no Photoshop e fique muito mais agradável e bem acabada.

UX designers começaram a surgir nesses ambientes como "arquitetos de informação", sendo essencialmente responsáveis por organizar o conteúdo de um site dentro do menu e desenhar caixinhas cinzas que representam como uma interface irá funcionar (os tais "wireframes").

Mas à medida que o ecossistema digital das marcas se tornou complexo demais para caber em menus, esses mesmos sujeitos acabaram assumindo um papel um pouco mais estratégico no processo criativo. Hoje, algumas empresas já colocam o UX designer fazendo o meio de campo entre o pensamento estratégico (planejar um produto) e o pensamento prático (desenhar um produto), ajudando a definir como as ideias, especialmente as digitais, irão tomar forma.

No dia a dia, o UX designer trabalha desenhando a estrutura desses produtos digitais. Ele não chega a definir a identidade visual do produto – normalmente, isso fica a cargo de um profissional especializado em Direção de Arte. Em vez de definir se o botão será azul ou vermelho, retangular ou arredondado, o papel do UX designer é definir questões mais estratégicas sobre tal botão:

---

• Porqueobotãoexiste?

• Qual a importância dele naquele contexto ou página em que ele
aparece?

• Eleéaaçãoprimáriaousecundáriaqueousuáriopodetomarnaquele
momento?

• Paraondeousuárioserálevadoquandoclicarnobotão?

• Oqueotextodobotãodevedizerparaousuário?

• Obotãoestásempreativo, ouelesóéativadodepoisqueousuário
preencherdeterminadocampoemumformulário?

• Todososusuários,logadosounãonosite,veemomesmobotão?

• Otamanhodobotãoestáadequadoparaserclicadotantocomoponteirodomouseemumcomputadordesktopquantoporumdedohumanoemumainterfacetouch(celular,tablet)?

• *Adinfinitum.*

Alistaégrande. Reparequealgumasdessasdecisõesnãosãotomadas
exclusivamentepeloUXdesigner:algumasdelassãofeitasemconjuntocom
odiretordearte,comodesenvolvedor,comogerentedeprojetoseoutros
profissionaisquetambémestãoenvolvidosnacriaçãodoproduto.

Costumo dizer que o profissional de UX é um camaleão dentro do time (http://www.uxbooth.com/articles/
the-ux-chameleon-and-its-multidisciplinary-skin) : precisa saber se
adaptaradiferentescontextos,conhecerovocabuláriodediferentesprofissionais (saber falar “a língua” do programador front-end, mas também
conhecerosjargõesdosdesigners)eentenderumpoucodecadadisciplina.

Mas,acimadetudo,osUXdesignersprecisamconhecersobrepessoas.
Ospróximoscapítulosdestelivrofalamumpoucomaissobreisso.

---

## 1.3 QUALQUER UM PODE SER UX DESIGNER

Hoje em dia existe muito misticismo em torno da figura do UX designer, de qual o seu papel dentro de um time e de quais os requisitos para que alguém coloque a sigla "UX" no nome do cargo no Linkedin. Na prática, basta ter bom senso, organização, pensamento sistemático e disposição de entender do que as pessoas precisam.

“Eu já tive um pouco de problema em entender o que um UX designer faz de verdade, e eu continuo chegando sempre à mesma conclusão: um user experience designer não faz nada de especial. Ele é só um designer. Todos os produtos têm uma experiência do usuário (UX). E essa experiência não é explicitamente desenhada; é um subproduto de desenhar uma interface.” Daniel Eden

Fonte: http://daneden.me/2013/03/20/ux-is-not-a-standalone-job

A citação vai direto ao ponto: todos os profissionais que contribuem de alguma forma para a construção de uma interface que será usada por pessoas são, por tabela, designers da experiência do usuário (ou UX designers).

A convenção de ter um profissional 100% dedicado a "puxar a sardinha" para o lado do usuário é apenas o remédio para um problema anterior: um modelo de trabalho que muitas vezes negligencia a importância de se desenhar produtos que sejam focados em necessidades reais de pessoas reais. Não adianta uma interface linda, com cores marcantes e bom gosto visual, se ela não está resolvendo aquilo que as pessoas querem resolver ao usá-la. Se o gerente de projetos está preocupado com verba e prazo, o desenvolvedor está preocupado com as limitações técnicas de determinada linguagem e o cliente está preocupado com os objetivos de negócios da marca, o UX designer é o profissional que entra na equação para assumir o papel de advogar pelos interesses do usuário.

Uma prova de que os requisitos para ser um UX designer são mais simples do que parecem é o fato de que vários profissionais da área vêm de formações diferentes: jornalistas, publicitários, designers gráficos, engenheiros, bibliotecônomos. Também são comuns profissionais que, antes de serem UX designers, trabalhavam como programadores front-end, redatores ou ger- entesdeprojetos. Algumasvezessãopessoasquedesempenhamumpapel
híbridoentreduasoumaisdessasdisciplinas.

## 1.4 As diferentes faces do UX designer

Porserumaáreabastanteampla, algunsUXdesignersacabamassumindo
funçõesmaisespecíficasàmedidaqueavançamemsuacarreira. Éumprocessonatural,jáqueperfisdiferentesdepessoaspodemtermaisfacilidade
comumaáreaououtradentrodoDesign.

Sevocêtemfacilidadeemorganizarconteúdo,épossívelqueprefirafocar
seusesforçosemArquiteturadeinformaçãooutaxonomia.Setemfacilidade
emlidarcompessoas,talvezprefirainvestiremPesquisacomusuários.

Masseessestermosaindanãosãofamiliaresparavocê,vejaaseguiruma
breveexplicaçãodealgumasdasprincipaissubáreasdeUX:

Arquiteturadeinformação:adisciplinatemsuasraízesnabiblioteconomia(organizarecatalogarostítulosdentrodeumabibliotecaparaquesejamfacilmenteencontradaspelovisitante)eédecertaformasimilarnoambientedigital. Comofazercomqueasinformaçõessejamorganizadasno
menudeumsite,porexemplo,deformaquesejamacessadasfacilmentepelosusuários?Qualperfildeusuárioestábuscandoqualtipodeinformação?
Comoositensestãoordenados,agrupadoseorganizadosdentrodaestrutura
dosite?

---

**Usabilidade:** garantirqueasinterfacessejamfáceisdeusar. Ousuário
conseguerealizarumatarefasemtranstornooudemora? Emumnúmero
razoáveldepassos?Asinformaçõessãofáceisdeentender?Oresidualapósa
experiênciaépositivo,ouousuáriosaiucognitivamenteexaustodali?

---

Designdeinteração:entenderedefinirocomportamentodasinterfaces
quandoousuáriointeragecomelas.Oqueacontecequandoeuclicoemdeterminadobotão?Comoainterfaceresponde?Comoeuarrastoumproduto
parameucarrinhodecompras?Qualaexataquantidadedeinformaçãoque
ousuárioprecisasaberpararealizaratarefanaquelemomento?Comoainterfacepodeserusadaparacriarumanarrativanaexperiênciadousuário?

Taxonomia:organizarerotularainformaçãodeformaquefaçasentido
paraousuário.Acategoriadalojavirtualirásechamar“Refrigeradores”ou

---

“Geladeiras"?Eseousuáriobuscarpor“Freezer”,oqueacontece?Operfildemográficodousuáriodaquelesite/appestáhabituadocomaquelalinguagem?
Comoclassificaraseditoriasdeumportaldenotícias?Quasetudoqueexiste
nomundopodeserclassificadodeacordocomalgumesquemataxonômico
—deespéciesdeplantasapaísesecontinentes.

+ +

Estratégiadedesign:éoentendimentoedefiniçãodosporquêsdoproduto. Paraquemelefoicriado? Comooprodutoevoluicomopassardo
tempo?Quaisosseusobjetivosdenegócioecomoelesserãoalcançadosem
cadaetapadesuaevolução? Comomedirsucessoumavezqueoprodutoé
lançado? Qualoretornoesperado? Quaisferramentasdedesignpodemser
usadasparaatingiremensuraressesucesso?

?

Pesquisacomusuários:éoentendimentodopúblico-alvodoproduto.O
quefazumapessoairatéosite?Quaisasnecessidades,anseiosemotivações
queessapessoatemaousaroproduto? Quaisasprincipaistarefasqueela
querrealizar? Quaisasparticularidadesdocomportamentodessegrupode
usuáriosqueinfluenciamasdecisõesdedesignàmedidaqueoprodutoé construido ou evolui?

## 1.5 O QUE UX DESIGN NÃO É

Para começo de conversa: UX Design não é direção de arte. También não é planejamento, não é gerência de projetos, não é desenvolvimento de software. UX faz o meio de campo entre todas essas disciplinas, garantindo que todas elas estejam caminhando juntas em direção a um mesmo objetivo. É o UX designer, por exemplo, que traduz a estratégia criada pelo planejador em forma de telas e fluxos que serão utilizados pelo usuário.

UX também não é, definitivamente, uma disciplina exata. Muitas vezes, as pessoas procuram se aproximar de UX Design para conseguirem tomar decisões sobre "qual tipo de menu usar no meu site" ou "como melhorar a usabilidade para aumentar as conversões do meu formulário de cadastro".

O fato é que as respostas para essas perguntas dependem de uma quantidade tão grande de fatores que é impossível afirmar com precisão que o caminho certo é o A ou o B. Mas também é essa grande parte da beleza do Design: o fato de que tudo depende de como as pessoas se comportarão, algo bastante difícil de prever. O UX designer não é um profeta que sabe como as pessoas pensam; ele é um pesquisador que investiga o que levou uma determinada pessoa a agir de determinada forma e então propõe melhorias de design baseadas nesses insights.

UX Design também não é uma disciplina de um software ou linguagem só. Podem até existir UX designers especializados em desenhar sites em HTML, ou aplicativos em C++; mas por ser centrada no comportamento humano, a teoria que estrutura o trabalho desse profissional é agnóstica de código, plataforma ou tamanho de tela.

## 1.6 DESENVOLVEDORES TAMBÉM SÃO UX DESIGNERS

Antigamente existia um certo atrito entre designers (não só UX) e desenvolvedores no decorrer do andamento dos projetos. Em alguns lugares isso ainda é comum. Designers brigando pela perfeição dos pixels, que por falta de competência do desenvolvedor não tinham ficado iguais ao Photoshop na hora detransformarainterfaceemHTML.Dooutrolado,desenvolvedoresreclamandodo“excessodecriatividade”dosdesignersnahoradebolarlayouts
quepudessemserreplicadosnalinguagemdoprodutofinal.

DEVELOPERS DESIGNERS PROJECT MANAGERS
SEEN BY DEVELOPERS
SEEN BY DESIGNERS
SEEN BY PROJECT MANAGERS
TRANSLATED BY @ALEXTOUL

Figura1.3:Comodesigners,desenvolvedoresegerentesdeprojetosseveem

Mas os tempos mudaram. A linguagem visual das interfaces digitais
amadureceumuitonosúltimosanos,foificandomaissóbria,flat,commenos
elementosdecorativosemaisfocoempermitirqueousuáriorealizetarefas
comfacilidade.Oadventododesignresponsivoeanecessidadedecriarlayoutsfluidosqueseadaptemamúltiplasresoluçõesdetelatambémfizeram
comqueasequipesaospoucossedesapegassemdoexcessodegrafismoseda
precisãodospixels,quepassouaseralcançávelapenasdentrodofantástico
mundodoPhotoshop.

Dooutrolado,desenvolvedorespassaramasepreocuparmaiscomaexperiênciadousuárioeaaceitarsugestõesdosdesignersquefocassememmel- horarausabilidadedoproduto.Afinal,odesenvolvedorcompreendeuqueo
designernãoestavalásóparadificultarsuavida.

Essaaproximaçãoesimbioseentreasáreaséummovimentoextremamentesaudável,equemsaiganhandoéousuáriofinal.

Hoje,bonsdesignersjáperceberamquesãoosdesenvolvedoresquefazem
deleumbomdesigner,jáquesãoelesosresponsáveisporfazersuasideias
tomaremforma. Designerssemdesenvolvedoressófazemlayoutsestáticos,
que ficam bonitos no portfólio mas que não chegam a impactar positivamentearotinadopúblicofinal. Poroutrolado, desenvolvedoressemdesignerscriamsistemasrobustosepoderosos,masqueàsvezespecamemser
agradáveisefáceisdeusar.

VejanoboxodepoimentodeBradFrost(http://bradfrostweb.com),um
programadorfront-endqueficouconhecidoporestudarecontribuircomo
conhecimentodacomunidadededesenvolvedoressobredesignresponsivo.

---

## DEPOIMENTO DE BRAD FROST

“Mesmo quando meu cargo era nomeado ‘web developer’ ou ‘open standards developer’, eu costumava me nomear ‘front-end designer’. Agora eu simplesmente me nomeio ‘web designer’. Desenvolvimento de HTML e CSS é design. Os projetos mais frustrantes de que participei são aqueles onde as pessoas não entendem por que desenvolvimento frontend precisava ser envolvido cedo no processo de design. Os projetos mais recompensadores, por outro lado, foram aqueles que envolveram desenvolvores front-end desde o começo.

Eu especificamente evito chamar meu cargo de desenvolvedor porque as pessoas acabam assumindo que eu posso programar em Ruby ou normalizar alguns bancos de dados. Eu nunca tive nenhuma aula de Ciência da Computação. (...) Quase todo trabalho de programação que eu fiz era para manipular elementos em uma tela. Apesar de aos poucos continuar aprendendo coisas sobre programação, eu não ousaria me chamar de programador.

HTML não é programação. CSS não é programação. Mas, porque eles ainda assim são códigos, desenvolvedores front-end muitas vezes são colocados na mesma gaveta dos programadores Python, Java, PHP, Ruby, C#, C++, Objective C etc., em vez de serem colocados juntos do time de design. Isso é um grande problema.

À medida que a Web continua se tornando incrivelmente complexa, é bastante importante atentar às inúmeras formas pelas quais uma experiência na web pode ser desenhada. É impossível para designers trabalhando em ambientes estáticos conseguirem articular realisticamente cada dispositivo, configuração de usuário e variável que afeta como o design é materializado. Por esse motivo, desenvolvedores front-end precisam trabalhar muito próximo a designers para garantir que o que está sendo desenhado é realista e factível. Isso inclui, entre outras coisas, garantir que as entregas de front-end façam parte das entregas de design."

Bons UX designers já se deram conta da importância de trazer o desen- volvedorparaasdiscussõescriativasoquantoantesnatimelinedeumprojeto. Alémdegarantirmaisclarezasobreaquiloqueestásendocriado,essa
aproximaçãoentreasáreastambémpermitequeoprocessosejamaiságil,já
queotimeconseguepartirparaaetapadeprototipaçãodaideiamesmoantes
deolayoutestarprontonoPhotoshop.“Testearlier,failfaster”,dizemporaí.
Equantoantesvocêtestaseumasoluçãofuncionaounão,antesvocêpode
começaramelhorá-la.

Otrabalhofeitopelosdesenvolvedorestemimpactodiretonaexperiência
dousuário,paraobemeparaomal.Nodecorrerdolivro,vocêveráalguns
exemplosdeboasemáspráticasdeinterfaceemaissituaçõesemqueaparceriaentredesignersedesenvolvedorespoderenderbonsfrutos.

---

Capítulo 2

# MétodoseentregáveisdeUX

QuasenadadaquiloqueédesenhadoouprojetadopeloUXdesigneracaba
sendo“visto”peloconsumidorfinal.TodososentregáveiseprocessosutilizadosemUserExperiencetêmcomoobjetivofacilitaracomunicaçãoentreos
membrosdotime,documentardecisõesqueforamtomadasemreuniõese
brainstorms,colherinsightssobreaquiloqueosusuáriosfinaisprecisame/ou
garantirquetodosestejamalinhadosarespeitodoqueestásendocriado.

OsentregáveisproduzidosporprofissionaisdeUXvariambastantede
acordocomotipodeprojeto,asexpectativasdocliente,osobjetivosdedesign
eosmembrosdotimeenvolvidosnahoradepensarnosdetalhesdoproduto.
Porsetratardeumaáreamultidisciplinar,osmétodoseentregáveisutilizados
eproduzidosnodiaadiadeumUXdesignersãofortementeinfluenciados
pelosprocessosemétodosdeoutrasáreasrelacionadas.

Definiraestratégiadedesign,gerarideiasatravésdebrainstorms,planejarasfuncionalidadeseaevoluçãodeumproduto,testá-locomusuáriose capturar insights através de pesquisa - esses são alguns exemplos de métodos que ajudam não apenas o UX designer, mas todos os membros do time, a desenhar produtos que sejam realmente relevantes para as pessoas.

Nem todos os métodos listados aqui são utilizados em todos os projetos. Se você não trabalha diretamente com UX, acaba conhecendo apenas dois ou três métodos mais comuns, que se materializam em entregáveis como Wireframes, Sitemaps e Personas. Conhecer esses métodos e saber qual a hora certa de usar cada um deles é uma das habilidades mais procuradas em profissionais de UX no mercado.

A ideia aqui não é fazer uma an métodos. No final do capítulo há um mais sobre eles.

lise aprofundada sobre cada um dos nk caso você tenha interesse em saber

## 2.1 DEFINIÇÃO DA ESTRATÉGIA

Nesse grupo entram os métodos utilizados no momento inicial do projeto, quando a estratégia está sendo definida e o time está preocupado em direcionar o produto para um lado ou para o outro. Ao contrário dos processos mais famosos, como wireframes e sitemaps, a preocupação aqui não é documentar como a interface funciona, e sim embasar decisões mais abstratas sobre a "razão de ser" do produto.

## Blueprint

Um mapa que mostra todos os pontos de contato entre consumidor e marca, bem como os processos internos necessários para que essa interação aconteça. É útil para visualizar o caminho que os consumidores percorrem em múltiplos canais (site, serviço de atendimento ao consumidor, loja física etc.) e para identificar oportunidades de melhoria.

---

Time Indicator

Customer
Role 1
Table Reservation Online
Confirmation by SMS

Media-Touchpoint
Enter customer details and email address

Order Information
Green button

Spammer is sent to customer via email or phone

Waitress
Role 2
Written greetings and hello message
Written status the food order
Food order send message to kitchen

Media-Touchpoint
Written greetings and hello message
Food order send message to kitchen

Cook
Role 3
Mail request
Communication delay with manager

Media-Touchpoint
Message and delivery to kitchen

Manager
Role 4
Manual response from Tel. No. Tracking

Media-Touchpoint
Correct rule also prepared

Fail Line
+

Emotions
+

Figura2.1:Blueprint—Fonte: http://www.servicedesigntools.org/tools/35

## ConsumerJourneyMap

Umdiagramaqueexploraosmúltiplos(ealgumasvezesinvisíveis)passos
tomadospeloconsumidoràmedidaqueelesseengajamcomoserviço.Permitequeosdesignersdefinamasmotivaçõesenecessidadesdoconsumidor
nasváriasetapasdajornada,criandosoluçõesdedesignquesejamapropriadasparacadaumadelas.

---

<Client> / Customer Journey
Buying A No-Contract Mobile Phone

Construct Competition
Sample Search
Browse Phones
What Are The Phone Types & Colors?
What Do The Reviews Say?
What's The Cost?
What's The Price?
Are My Available Customers?
Can I Bring My Phone & Number?

Browse Phones
Phone Details
What Does It Cost You Much?
What Do The Reviews Say?
What's The Price?
In These & More Things?
In This The Right Phone For Me?

Check Out
Confirmation

Mea Board

Make De Call
Born Again No Contract Bonds
Join The Trail Games
Connect Community Gap
An amazing Age Trains
On We Three Calculator
Emerge Rampage Sales
Beauty Advice
See To Be Born
Add 4 All Functionality

Phone Bridal C3M
HR HR Design TXT

Figura2.2: ConsumerJourneyMap—Fonte: http://blog.uxpin.com/2202/
designing-an-online-store-its-all-about-the-side-doors/

## UserStories

Umdetalhamentodecadatarefaqueousuáriodesejacumpriraointeragircomoproduto. Bompararelembrarotimedasmotivaçõesquelevamo
público-alvoausarcadaumadasfuncionalidadesdoproduto,assimcomoo
caminhoqueosusuáriospercorrerãoparafazê-lo.

---

When____
Situation

I want to____
Motivation

So I can____
Expected Outcome

Figura2.3: UserStories—Fonte: https://medium.com/the-job-to-be-done/

## Personas

Umretratodopúblico-alvoquedestacadadosdemográficos,comportamentos,necessidadesemotivaçõesatravésdacriaçãodeumpersonagemficcionalbaseadoeminsightsextraídosdepesquisa. Personasfazemcomque
osdesignersedesenvolvedorescriemempatiacomosconsumidoresdurante
oprocessodedesign.

---

2.1. Definição da estratégia

## Teach Me TINA

# LEARNING FOCUSED Teacher

Science Teacher Crabapple Middle School

Education Roswell, Georgia

## “Tell me more! I need Internet at home and in my classroom. So, it’s got to work. When I do have trouble, though, I want to be able to fix it quickly on my own.”

My school continuously strives to be a premier educational institution in the state of Georgia. Technology is now a part of our everyday lives, so I use technology and the Internet in my classroom. I use it for personal projects, but also for classroom projects with all of my students. When in a classroom with 30 middle school kids, I don’t have time to call the DSL provider if I have trouble with the connection. So, I need to be able to troubleshoot problems on my own, right there on site. If I have too many connection problems, I will report it to our school principal and recommend that we use a different DSL provider. As Teachers, we don’t have a lot of time to deal with extra problems, outside of our everyday chaos.

At home, I use the Internet to do research for the book I am writing. I am also an avid cook, so I connect almost every evening to pick out recipes and view the recipes I’ve saved online. When I am at home, I have a little bit more time to troubleshoot if needed. And, I do prefer to fix the problem myself, if possible.

This user has a high need for connection and a moderately high willingness to troubleshoot problems when they arise. She is interested in what is happening and why the function is being performed. She wants to learn about her computer and DSL Tina will study simple wiring diagrams, try to check connections and will download DSL software. She wants to learn more computer jargon, but explanations may be needed. She may also use a chat for customer support, to learn how to fix her DSL connection in her classroom or at home by herself.

Figura 2.4: Personas — Fonte: http://uxmag.com/articles/personas-the-foundation-of-a-great-user-experience

---

## Ecossistema

Uma visualização em mapa das propriedades digitais da marca, das
conexõesentreelasedesuafunçãonaestratégiademarketing. Oecossistemadáinsightsvaliosossobrecomoaproveitaraspropriedadesqueamarca
possui(easnovasqueestãosendocriadas)paraatingirosobjetivosdenegócios.

Tariff Plans
Queries/FAQ
Subscribe to VAS
Check new services/products/offers

Customer Care
Activate/
deactivate services
Queries/Problem solving
Check bills
Store Locator
Tariff Plans

Kirana Store
Buy Plans
Unsolved/Major problems
Bill Payment
Information on VAS

Website

Download Software
Download VAS

WAP Site

Casual User

Drop Box
Bill Payment

Friends & family
Employer
Door to door sales
Advertisement
Phone Calls
SMS

Figura2.5:Ecossistema—Fonte: http://hfiuxcentral.ning.com/forum/topics/
new-white-paper-kindle-fire-solid-proof-that-usability-is-no

## Análisecompetitiva

Umaanáliseextensadosprodutosconcorrentesquemapeiaasfuncionalidadesexistentesemcadaumdelesdeformacomparativa.Ajudaaentender
ospadrõesqueestãosendocriadosnaindústriaeaidentificaroportunidades
deinovaremdeterminadomercado.

---

Feature Tyneside Empire Glasgow Film Theatre Star & Shadow Side Cinema Sage Cinema Live Theatre Contact Theatre Watershed
Buy Ticket Online Yes= must queue to collect tickets. Yes= Simple and allows User to choose seat. Yes= Categorised films list or quick buy option. No= No ticket or booking system. Yes= Part of the Amber Online Shop. Tickets delivered through post. Yes= Choose level, then seating. Also virtual preview of seats. Yes= Events schedule is badly structured and not clear. Yes= Can be bought online but must collect at Box Office. Yes= Can be bought online but must collect at Box Office.
Film Info - Search Films No= Manual list of films. No= Manual list of films (by day). No= Manual list of films (by day/week). Yes= Search for film title. Also by calendar. No= Manual list of films. Yes= Search by Keyword, Event, Genre or manually. Yes= Search results split into Events & News articles. Yes= Global or Manual search or by Calendar, (day, week). Yes= Global search or by Calendar, (day, week).
Film Info - Detail / Times Yes= times are separate from description. Yes= times are separate from description. Yes= description & time + online ticket purchasing. Yes= includes times, description and cover art. Yes= description & time + online ticket purchasing. Yes= description & time + online ticket purchasing. Yes= description & time + online ticket purchasing. Yes= description & time + online ticket purchasing.
Film Info - Watch Preview Yes= Some films have previews but are small. No= Some films have links to official site. Yes= Some films have previews but are small. No= Some have links to official homepage or YouTube. Yes= YouTube link from Facebook page. No= Theatre Events don't require previews. Yes= Some performances have small embedded YouTube video clips. Yes= Some performances have large embedded YouTube video clips. No= No preview but has some small screen shots.

Figura 2.6: Análise competitiva — Fonte: http://www.onebigfield.co.uk/
clients/tyneside-cinema-ux-re-design-of-digital-offering/

## Proposiçãodevalor

Ummétodoredutivonosestágiosiniciaisdadefiniçãodoprodutoque
mapeiaseusaspectosprincipais:oqueoprodutoé,paraquemelefoicriado
ecomo/quandoeleseráusado. Ajudaotimeaafunilarasopçõeseacriar
consensosobreoprodutoqueelesestãoprestesadesenhar.

---

Value Proposition

First Sentence - Value of the Offering

Target Customer

For ...

Statement of the Need or Opportunity

who ...

Product/Service Category

our (product/service name) is ...

Statement of Benefit

that ...

Second Sentence – Positioning the Value

Primary Competitive Alternative

Unlike ...

Statement of Primary Differentiator

our product...

Proof that Benefits can be Delivered

because of our...

Figura 2.7: Proposição de valor — Fonte: http://www.goldsbrough.biz/
value-proposition/

## EntrevistascomStakeholders

Roteirosdeentrevistacomosprincipais *stakeholders* (aspartesenvolvidas)deumprojeto,tantointernosquantoexternosàempresa,paracoletar
insightssobreosseusobjetivos. Ajudamapriorizarasfuncionalidadesea
definirasmétricasdesucessodoprojeto.

## KeyPerformanceIndicators(KPIs)

Critériospreestabelecidosqueajudamamedirosucessodoprodutoem
relaçãoàestratégia,paragarantirqueoprodutoatinjaoresultadoesperado.
KPIsajudamnasdecisõesdedesignquesãotomadasnomeiodocaminhoe
tambémamedirresultadosdotrabalhodeUXDesign.

---

## 2.2 Geração de ideias

Essegrupodemétodoséutilizadoduranteaetapacriativadoprojeto. Eles
ajudamacoletarasideiasdetodososmembrosdotimeeagarantirqueeles
estejamalinhadosemrelaçãoaoqueoprodutoestácomeçandoasetornar.

## Brainstorming

Oprocessocoletivodegeraçãodeideias,semrestrições,querespondem
adeterminadobriefcriativo.Ajudaotimeavisualizarumagrandevariedade
desoluçõesdedesignantesdeefetivamentedecidiremcomqualopçãoeles
seguirãoemfrente.

POLICY INFORMATION

Figura 2.8: Sessão de Brainstorm — Fonte: http://www.duarte.com/blog/
take-your-meetings-by-storm/

## Moodboard

Uma coleção de imagens e referências que eventualmente se transformarãonoestilovisualdoprodutoemquestão.Ajudaoscriativosamostrarem
paraosclienteseparaoscolegasdetimealinhavisualqueestãoimaginando
paraoprodutoantesmesmodeabriremoPhotoshopecomeçaremafazero layout.

HOME
SAUSAGE
VARIETIES
Specialties
ROOFTOP
BEEF & WINE GARDEN
Shop Gone's
OUR STORY
CATER
PRESS -
CONT

WEAK & BACON
FROM DRAW
SWASHED POMO
DRESSED GREENS
INCLUDES

SPOOL No72

THE WHO'T STORI

401K

BYO

WITH THE SAPPLEY

IDEA

HONEST AUTHENTIC
HOMELY FRIENDLY WARM
APPROACHABLE CRAFTED

SAUSAGE
HANDMADE
IN-STORE DA

Figura 2.9: Moodboard — Fonte: http://clearleft.com/thinks/
visualdesignexplorations/

## Storyboards

Umaespéciedehistóriaemquadrinhosdasériedeaçõesqueosconsumidorestomarãoenquantoestãousandooproduto.Traduzemfuncionalidades
deformamaistangível,emsituaçõesreaisdodiaadia,ajudandodesignersa
criaremempatiacomoconsumidorenquantojácomeçamaterumaideiado
escopodoproduto.

---

Welcome to Sears
SAVE LOCATION

Sears

SHOPS PROMOS
SAVE LOCATION

Sears
ADD TO CART
SEND TO CASINER
SHARE

ADIDAS SPECIAL ED
Pay Price $57
NEW PRICE
$60
SOME THIS MESSAGE

facebook
twitter

ADIDAS SPECIAL ED
Pay Price $57
NEW PRICE
$60
SOME THIS MESSAGE

Figura 2.10: Storyboard — Fonte: http://www.fabiangarzon.com/mobile_
deals_2010.html

## Fluxodousuário

Umarepresentaçãovisualdofluxodousuárioparacompletartarefasdentrodoproduto.Ousuáriocomeçapelahomepage,depoisentranapáginade
umproduto,depoisvaiatéocarrinhodecompras–eassimpordiante. É
aperspectivadousuáriosobreaorganizaçãodosite,queajudaaidentificar
quaispassosprecisamsermelhoradosouredesenhados.

---

A State to Screen take
User Story X
This works in some cases and works in other CX.
B Animated Moving Painters
Point 0

Figura2.11: Fluxodousuário—Fonte: http://wireframes.linowski.ca/2010/
04/grand-narratives-play-points/

## Análisedetarefas

Umdetalhamentodasinformaçõeseaçõesnecessáriasparaqueousuário
completeumatarefa.Ajudadesignersedesenvolvedoresaentenderemosistemaatualecomoainformaçãotransitadentrodele. Tambémajudaadistribuirastarefascorretamentenonovoprodutoqueestásendodesenhado.

## Taxonomia

Umaexploraçãoemtornodasmúltiplasformasdecategorizarconteúdo
einformação: comoaseditoriasemumsitedenotíciasouascategoriasde
produtosemume-commerce,porexemplo.Contribuiparaqueosdesigners
definamaestruturadeconteúdoerótulosqueajudarãoousuárioasemovimentarpelosite.

## 2.3 Planejamento do produto

Essessãoalgunsdosmétodosusadosquando,passadaaetapadegeraçãode
ideias,chegaahoradeplanejaredesenharoprodutoemquestão.

---

## Auditoriadeconteúdo

Éaatividadedelistartodooconteúdodisponívelemumsite. Alista
seráutilizadaemváriasetapasdoprojeto,ajudandoaenxergarsuatotalidade,
definiraestratégiadeconteúdoeaaveriguarosdetalhesdecadaumadas
páginas.

## Análiseheurística

UmaanáliseminuciosadeumprodutoquedestacaasboasemáspráticasdeUX,usandoprincípiosconhecidosdeDesigndeInteraçãocomoguia.
Ajudaavisualizaroestadoatualdosistemaemmatériadeusabilidade,eficiênciaeeficáciadaexperiência.

Home Page
Accessibility 100%
Task Orientation 75%
Page Layout & Visual Design 50%
Navigation & IA 25%
Forms & Data Entry 0%
Help, Feedback & Error Tolerance
Search
Trust & Credibility
Writing & Content Quality

Figura 2.12: Análise heurística — Fonte: http://www.smashingmagazine.
com/2011/12/16/a-guide-to-heuristic-website-reviews/

## Sitemap

UmdosmétodosmaisconhecidosdeUX.Consisteemumdiagramadas
páginasdeumsiteorganizadashierarquicamente.Ajudaavisualizaraestru- turabásicaeanavegaçãoentreasdiferentespartesdosistema.

aequitas CAPITAL Education Plus User Experience: Site Map

Log In (Modal)
Terms (Modal)
Privacy Policy (Modal)

Home Page

About
Contact

What's Education Plus (or alternate static content page)

Security (or alternate static content page)

Convenience (or alternate static content page)

Consolidation (or alternate static content page)

Get a Loan Step 1: Sign Up

Manage an Existing Loan Log In

Reset Password Request

Authenticated

Dashboard (authenticated user home page)

Manage Account: Change Password

Manage Account: Change Contact Info

Get a Loan Step 2: Contact Info

Manage a Loan Redirect (is this a visible interstitial page?)

Reset Password Request Email Sent

Get a Loan Redirect (is this a visible interstitial page?)

Password Reset Email sent to User

Reset Password

Reset Password Confirmation

Loan Redirects (are these visible interstitial pages?)

Figura 2.13: Sitemap — Fonte: http://www.mattmairlowery.com/portfolio/
educationplus-portal/

## Roadmapdefuncionalidades

Éoplanodeevoluçãodoproduto,comasfuncionalidadesjápriorizadas.
Podeserumaplanilha,umdiagramaouumasériedepost-itsorganizados
sobreumpainel. Ajudaacompartilharavisãoestratégicacomotimeea
enxergarocaminhonecessárioparasechegaratélá.

---

Roadmap | Aha!
Aha! Aha! Application
Brian de Haaff @ Big Aha!

Product roadmap
Save View Publish

Show imperatives Show themes Use external dates Add release

Create new notebook
ADD TO NOTEBOOK:
Aha! Q4 2013 Roadmap

Nov Dec 2014 Feb Mar Ap

AHA! APPLICATION
Sprint 19
Fri, 25 Oct

Strategic imperatives
PM's best friend
Openness
Viral growth
APP-318 Export Release timeline view as a PDF or Web page
APP-350 Add "Release date" as a column that can be added to the grid view
APP-347 Add "Estimated effort" and "Logged effort" to the feature grid page

AHA! APPLICATION
Sprint 20
Thu, 26 Dec

Strategic imperatives
"Goal first" (get strategic)
PM's best friend
APP-348 Add "assignee" at requirements level
APP-382 Alphabetize the list of columns that can be added on the grid page
APP-359 Handles on release phases that show dates
APP-345 [INTERNAL] Active user viewed billing page

AHA! APPLICATION
What's next
Thu, 13 Mar 2014

Strategic imperatives
Viral growth
Openness
PM's best friend
APP-263 Super feature
APP-340 Releases - ability to set template phases and milestones by product
APP-198 Custom Fields
APP-287 Bugzilla integration
APP-321 Add basic lead tracking

Figura 2.14: Roadmap de funcionalidades — Fonte: http://www.aha.io/
product/features/publish

## Cenáriosecasosdeuso

Umalistaexaustivadoscenáriospossíveisenquantoosusuáriosestãointeragindocomoproduto: logado,não-logado,primeiravisitaetc. Ajudaa
garantirquetodasasaçõessãopossíveisdentrodosistema,assimcomovisualizarcomoelesecomportaemcadaumdoscenárioslistados.

## Análisedemétricas

Análisedosnúmerosfornecidosporalgumaferramentademétricasque
dãoinsightssobrecomoosusuáriosinteragemcomoproduto: númerode
cliques,tempodenavegação,palavras-chavebuscadasetc. Osnúmerosajudamadescobririnsightsvaliosossobreocomportamentodosconsumidores,
quemuitasvezesnãopodemsercapturadosemumtestedeusabilidade.

---

## 2.4 Pesquisa e validação

SãométodosutilizadospeloUXdesignerparaentendercomooconsumidor
pensa,oqueesperadoprodutoecomointeragecomele.

## FocusGroup

Umpaineldediscussãocomváriosusuáriossobredeterminadoassunto
ouquestão.Ajudaaentenderossentimentosdaspessoas,suasopiniõeseaté
alinguagemqueutilizamaofalaremsobreoproduto.Útilquandootimenão
estámuitofamiliarizadocomopúblico-alvodoproduto.

Figura 2.15: Sessão de Focus Group — Fonte: http://www.
quest-research-solutions.co.uk/

## Pesquisaquantitativa

Questõesqueproduzemumnúmerocomoresultado.Éumaformarápida
esimplesdemedirasatisfaçãodosconsumidoresecoletarfeedbacksobreo
produto. Aspesquisasquantitativaspodemapontaranecessidadedeoutro
tipodepesquisaemprofundidade.

---

| 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| Venue | ○ | ○ | ○ | ○ |
| Opening Address | ○ | ○ | ○ | ○ |
| Morning Presentation | ○ | ○ | ○ | ○ |
| Lunch Facilities | ○ | ○ | ○ | ○ |
| Afternoon Presentation | ○ | ○ | ○ | ○ |
| Q&amp;A Session | ○ | ○ | ○ | ○ |
| Post seminar social event | ○ | ○ | ○ | ○ |

Figura 2.16: Formulário de pesquisa quantitativa — Fonte: http://www.
surveygalaxy.com/default.asp?m=7&id=0009&dir=/articles/&lang=en-GB

## Testedeusabilidade

Umaentrevistaum-a-umcomoconsumidor,naqualpede-seaeleque
realizeumasériedetarefasemumprotótipooumesmonoprodutofinal.
Àmedidaqueoconsumidorinteragecomoproduto,opesquisadorfazanotaçõessobreseucomportamentoesuasopiniões. Ajudaavalidarfluxos,
layoutsefuncionalidades.

---

WORLD'S

Figura 2.17: Sessão de teste de usabilidade —
Fonte: http://curveagency.com/blog/user-experience/
responsive-wireframe-usability-testing-tips-and-tricks

## CardSorting

Umatécnicaqueconsisteempediraosusuáriosqueagrupemconteúdos
efuncionalidadesemcategorias.Dáinputsvaliososaotimesobrehierarquia
deconteúdo,organizaçãoetaxonomia.

## TesteA/B

Trata-sedeoferecerduasversõesdiferentesdoprodutoparadiferentes
usuárioseverqualdelastemmelhoresresultados. Ótimoparamelhorara
taxadeconversãodefunisdecompra,landingpagesouformuláriosdecadastro.

---

## Eyetracking

Umatecnologiaqueconsegueanalisaromovimentodosolhosdousuário
àmedidaqueeleinteragecomoproduto.Dáinformaçõessobreaspartesda
interfacequemaisinteressamaousuárioetambémsobrequalaordemde
leituradoselementosdatela.

## Análisedeacessibilidade

Umestudoquemedeseositepodeserusadoporqualquerpessoa,incluindousuárioscomnecessidadesespeciais.

## 2.5 Desenho de interfaces

EssessãoosentregáveismaiscomunsdeUXDesign:aquelesquedocumentamcomodeterminadateladevefuncionar.Sãoótimasferramentasparacomunicarideiascomoutrosmembrosdotime,clientesetodasaspartesenvolvidasnoprojeto.

## Sketches

Umaformarápidaderabiscarumanovainterfaceusandopapelecaneta.
Sketchespodemsermuitoúteisparavalidarrapidamenteconceitosdeprodutoseideiasdedesigncomosoutrosmembrosdaequipeecomusuários.

---

MY TODOS
1.05

SPLASH SCR.

MY TODOS
TO DO 4
ONGOING 2
DONE 1.000
WAITING
SOME DAY

OVERVIEW
SUB MENU II

MY TODOS
TO DO 4
ONGOING 2
DONE 1.000
WAITING
SOME DAY

OVERVIEW
SUB MENU I

TODO:
REMOVE
ONGOING

Figura2.18:Sketches—Fonte: http://www.smashingmagazine.com/2013/06/
24/sketching-for-better-mobile-experiences/

## Wireframes

Umguiavisualquerepresentaaestruturadapágina,bemcomosuahierarquiaeosprincipaiselementosqueacompõem.Útilparadiscutirideiascom
otimeecomosclientes,etambémparainformarotrabalhodosdiretoresde
arteedesenvolvedores.

---

990px wide

California Association of Directors of Activities

Contact Us | Forums SEARCH

Join CADA
Area Information
State Convention
About CADA
Our Sponsors
CASL
Shop CADA
Resources

“Hero” image
Leadership Development Days

CADA is the largest statewide support network for Activity Directors in the nation.
Our mission: promote and support leadership development and student activities.

Member Login

Username:
Password:
Remember me
LOG IN
Not a CADA member? Join today

Promo item
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
Take the survey

New to CADA?

Which membership is right for me?
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Apply online

How CADA can help you
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspermatur aut odit aut fugit. Find out more

CADA community

Membership renewals
All memberships renew on June 30.
RENEW TODAY

Conferences & events
This year's State Conference is on July 30, in Las Vegas. Find out more

Area news
• Sed ut perspiciatis unde
• Omnis iste natus error sit voluptatum
• Accusantium doloremque laudantium
Choose your area
Help me locate my area

Vendors and affiliates

Vendor directory
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Find a vendor

Become an affiliate member
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Apply online

Copyright ©2009, California Association of Directors of Activities | CADA by laws | Privacy policy | Terms of use

Figura 2.19: Wireframe — Fonte: http://fundamentals.melissacabral.com/
evening-example-information-architecture-and-wireframe/

## Protótipos

Umprotótipoéumasimulaçãodanavegaçãoedasfuncionalidadesde
umsite,compostonormalmenteporwireframesclicáveisoulayouts.Éuma
formarápidadevalidaretestarumprodutoantesdedesenvolvê-lodocomeço
aofim.

## Bibliotecadepadrões

Umalistapráticacomexemplos(eàsvezescódigo)dospadrõesdeinteraçãoqueserãousadosemtodoosite.Nãosóajudaamanterodesignconsistenteemdiferentestelas,mastambémfacilitaavidadosdesenvolvedoresna
horadeimplementaroselementos.

---

Alistaébastanteamplaemesmoprofissionaisespecializadosacabamnão
dominandoouusandotodosessesmétodoscomfrequência.Nodecorrerdo
livro,vocêveráemmaisprofundidadealgunsdeles: **wireframes, protótipos,
sketches, bibliotecasdepadrões, testesdeusabilidade** e **testesA/B.**

## Gosta desse assunto?

SevocêseinteressaemconhecermaissobreosmétodosdeUX,acesse
http://fabricio.nu/metodos paravermaislinkseexemplos.

---



---

# Capítulo 3

# Wireframes,protótipose rabiscoframes

Wireframeéumdesenhobásicodaestruturadedeterminadainterfaceque
demonstradeformasimplificadacomooprodutofinaldeveráfuncionar.

---

Back Coin Toss

Make your prediction for the coin toss and win prizes

Images of the prizes

Make my prediction (Time Left 14:59)

Or I want to skip this challenge >

Back What will be the coin toss result?

FLIP COIN

HEADS

Make my prediction (Time Left 14:41)

Or I want to skip this challenge >

Figura3.1: WireframedoaplicativoPocketPass,daMetlife,quedesenvolvi
em2010

Normalmente,eleéfeitoemtonsdecinza,semimagens,eomaiorobjetivoéorganizaroselementosqueentrarãonacomposiçãofinaldodesign.
Essetipodedocumentaçãoajudatantoosdiretoresdearte–aentenderemos
elementosessenciaisnahoradecriarolayout–quantoosdesenvolvedores
–que, apartirdowireframe, jáconseguemestimaroesforçodetrabalho,
começaramodelagemdedadoseatéatestarsoluçõesdefront-endquese
adequemàsoluçãopropostapeloUXdesigner.

Pensenoprocessodeconstruçãodeumprédio. Antesdecomeçaraerguerasparedes(emesmoantesdecomprartodoomaterialnecessáriopara
aconstrução),existeumaetapadeplanejamento.Éprecisoentenderoobjetivodaqueleespaçoqueseráconstruído(exemplo:moradia),asfunçõesque aspessoasrealizarãoalidentro(comer,dormir,socializar)e,apartirdaí,criar
asváriasseções(cômodos)paraaspessoascircularem.

BATH
M.BATH
CPT VCT
CPT VCT
S&P
BEDROOM 1
9'6" x 9'3"
BEDROOM 2
10'3" x 9'9"
M.BEDROOM
9'9" x 11'9"
S&P
UPPER LEVEL
TOWNHOUSE #2,7,11
TOWNHOUSE (REVERSED) #3,8,12

Figura3.2:Oswireframesatéseparecemumpoucocomaplantabaixausada
porengenheirosearquitetos

Só quando está tudo definido, aprovado e testado, é que a construção
começaefetivamente. Noprocessodeconstruçãodeprodutosdigitaiséa
mesmacoisa.

---

## 3.1 Como nascem os wireframes

Paracriarowireframedeumproduto,oUXdesignercostumalevaremconta
váriosfatores:

• Osobjetivosdenegóciosdocliente,quenormalmentesãopassadosno
iníciodoprojetoemformatode *briefing;*

• Osrequisitostécnicosdosistema–sejaumnovosistemaouumsistema
legado;

• Oconceitocriativodoproduto,quandoexisteumtimedecriaçãoenvolvido;

• Osguidelinesdebrandingetomdevozdamarca/empresaemquestão;

• Asboaspráticasconhecidasdeusabilidadeenavegação;

• Aspossibilidadeselimitaçõestécnicasdaplataformaondeoproduto
finalserádesenvolvido(HTML,CSS,JS,C++etc.);

• Aspossibilidades,limitaçõeseboaspráticasdohardwareondeainterfaceseráacessada(computadoresdesktop,smartphones,tablets,caixas
eletrônicosetc.).

Umavezquetodosessesrequisitossãolevantados,chegaahoradeoUX
designercolocarnopapelumaprimeiramaterializaçãodoquesesabesobre
oproduto. Duranteoprocessodedesenhodeumwireframe,oprofissional
deUXprecisafazerumasériededecisõesqueeventualmenteinformarãoo
layoutdoproduto.

Qualaprimeiracoisaquevocêquerqueousuáriovejaquandoelechegar
nahomepagedosite? Queinformaçõesvocêprecisamostrarparaqueele
entendadoquesetrataoseuproduto?Comoaproveitaraaltavisibilidadeda
páginainicialparamostrarconteúdorelevanteparaosvisitantes?

---

Google Creative Sandbox, Technology and innovation lorem ipsum dolor sit amet.
CREATIVE
SANDBOX
Entre com sua conta Google
ENTENDA O PROJETO PRODUTOS GOOGLE IDEIAS RECEBIDAS
Let your ideas play.
ocultar detalhes
434 ideias
recebidas até agora
DM9/DDB Africa AgênciaClick F/Nazca Ogilvy AG2 AgênciaClick F/Nazca Ogilvy AG2 Ogilvy AG2
A Google Box já está circulando:
Google Box @ DM9/DDB São Paulo ideias recebidas Felipe S.: Título da ideia lorem ipsum dolor sit...

Figura3.3:WireframedositeGoogleCreativeSandbox,noqualtrabalheiem
2012

Alémdoconteúdodaspáginas,oUXdesignerprecisapensartambém
emum **métododenavegação** quepermitiráqueousuárionavegueentreelas.
Algunssitesouaplicativospossuemmenusfixosnotopo,comlinkparatodas
(ouasprincipais)páginas.Éocasodose-commercesousitesinstitucionais,
porexemplo.Jáoutrossitespossuemumfluxomaislinear:háapenasuma(ou
algumas)açõesqueousuáriopodetomarnaprimeirapágina,edependendo
dessaaçãoeleveráumanovapágina,eoutra,eoutra. Paraalgunssitesfaz
sentidodisponibilizarumcampodebusca,paraoutrosnemtanto.

Determinadosoconteúdoeanavegação,éprecisopensartambémnas
**interações.** Comoainterfacesecomportaquandoousuáriointeragecom
ela?Hásempreumatrocadepágina?Oualgumasvezesasaçõesdosusuários
revelarãonovosconteúdosnamesmapágina? Hásom? Háfeedbackpara
cadaaçãotomada?

---

Nofimdascontas,umdocumentodewireframeéadocumentaçãode
todasessasdecisõesdeformaclara,queconsigaserinterpretadaporoutros
profissionaisquetambémestãoenvolvidosnoprojeto.

## 3.2 Como interpretar um wireframe

Se você trabalha com desenvolvimento de produtos e interfaces digitais, é
provávelquejátenhavistoeusadowireframesnoseudiaadia. Mesmoem
timesemquenãoháumUXdesignerouarquitetodeinformação,outraspessoaspodemacabarficandoresponsáveisporplanejarosdetalhesdainterface
antesdeodiretordearteabriroPhotoshop–sejaoprópriodesenvolvedor,
umanalistadeespecificaçãoou,àsvezes,oprópriogerentedeprojetos.

Aindaassim,muitagentetemdúvidasobrearealfunçãodeumwireframe
edecomofiltraroqueestásendomostradoalidamaneiracorreta.

---

Start over
Step 4: Add toppings
Pepperoni Italian Sausage Ham Bacon Cheddar Feta Black Oil
Dominio's PIZZA
PIZZA MAKER
YOUR TIME 01'26"112

Figura3.4: WireframedoaplicativodeiPaddaDomino’s,noqualtrabalhei
em2011

Oqueowireframemostra:

• **Ahierarquiadainterface.** Elementoscommaispesovisualnowireframeindicamoselementosquedevemserpriorizadospelodiretorde
artenahoradecomporolayoutfinaldoproduto.

• **Disposiçãodasinformaçõesnatela.** Owireframenormalmentetraz
umasugestãoinicialdecomooselementosdevemserdispostosnainterfaceparagarantiraordemdeleituraadequadaparaousuário. É
claroqueodiretordeartepodepropormudançasnahoradecompor
olayout,masaestruturanormalmentepermaneceamesma.

• **Quantidadeetipodeconteúdo.** Apesardeowireframeusartextose
imagensdemarcação,atravésdelejáépossívelvisualizarquaisosdiferentesatributosqueaparecerãonainterface.Porexemplo:napáginade uma notícia teremos o título, o subtítulo, o texto completo, de 3 a 5 imagens, o nome do autor, a data de publicação e um espaço para comentários dos leitores.

- Menus e elementos de navegação. Os wireframes quase sempre contêm uma sugestão de como o menu do site/aplicativo estará estruturado: quais são os itens de menu, em qual ordem eles aparecem, como a navegação no menu funciona.

- Comportamento em vários tamanhos de tela. No caso de sites responsivos ou mesmo aplicativos de smartphone que funcionem no modo retrato e paisagem, os wireframes podem ser usados para explicar como o conteúdo da interface se adapta a diferentes tamanhos e orientações de tela.

- Requisitos de negócios e sistema. Como o UX designer leva em conta os requisitos passados pelo cliente e pelo time de desenvolvedores sobre como o sistema funciona, o wireframe já é uma representação apurada da funcionalidade do sistema.

- Variações e estados diferentes do sistema. O wireframe normalmente contém uma indicação de como uma mesma tela se comporta em diferentes condições: quando o usuário está deslogado, quando está logado, quando acessa o site pela segunda vez, quando entrou no site através de um banner ou ponto de entrada específico, quando uma determinada listagem contém zero item, um item ou duzentos itens – e assim sucessivamente. Normalmente, desenvolvedores e designers trabalham juntos para definir quais são as principais variações e Estados do sistema que precisam ser documentados pelo wireframe.

---

LOGO
LOREM IPSUM
DOLOR SIT AMET

NAVIGATION

YOUR BASKET IS EMPTY

MOST POPULAR

TODAY'S SPECIAL

OUR SHOP

11 TOTAL INFORMATION

Hungry?

MAP

Delivered fresh every day

LATEST NEWS

PLEASE CUPCAKES

home of the yummiest cupcakes in the entire universe:

Cupcakes Press Gallery Events FAQ About Us Contact Us

Your宝贝 is empty

Today's Special

Our Shop

11 TOTAL INFORMATION

Your宝贝 is empty

INVITE ME

WHAT YOUR FAVORITE CUPCAKE?

Menu List

Coupon List

Dealer Info

SIGN UP

EXTRA LISTING

Sign Up

Figura3.5:Comparativoentrewireframeelayoutfinaldeumsite

## Oqueowireframenãomostra:

• Olayoutfinal.Obviamente,owireframenãoéumespelhodoproduto
final.Botõespodemmudardeposição,linkspodemvirarbotõeseviceversa,imagenspodemacabarcomtamanhoouproporçõesdiferentes
nolayoutfinal,aordemdoselementoseaformacomoestãoagrupados
podemmudar.

• **Aidentidadevisualdamarca.** Detalhescomocores,tipografia,logo
equaisqueroutroselementosdebrandingserãorevisadospelodiretor
dearte.

• Textoeconteúdofinal.Depoisdowireframeterminado,normalmente
umredatoréquemvaitrabalharnosrótulosetextosfinaisdainterface.
ApesardeoUXdesignerjáfazerumasugestãodequalotamanhorecomendadodostextos, épossívelquemuitacoisamudenahorade
popularainterfacecomoconteúdorevisado.

---

• Todososcasosdeusodoproduto.Comoditoanteriormente,owireframenormalmenteconsideraosprincipaiscasosdeusoerefletevariações e cenários mais comuns que os usuários encontrarão no produto. Masexisteanecessidadedeumolharmaisapurado, normalmentefeitoporumanalistadeespecificaçãooudesenvolvedor,sobre
todososcenáriosquepodemacontecerquandoaspessoasforemusar
oproduto.Essescenáriospodemserrepresentadosporumanovarodadadewireframes,masemmuitoscasosapenasumadiscussãoentre
designersedesenvolvedoresésuficienteparadecidircomoainterface
secomportanessescasos.

## 3.3 As vantagens de usar wireframes no pro- cesso

PIT
Work Our Kitchen About Blog Contact

We make juicy web apps.
Apps that are easy and fun to use.
Together with you and your customers we design practical solutions that meet your and their goals.

Work with us -->

We cook!
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Familiaris dolor sit amet, consectetur adipiscing elit.
Nonummy dolor sit amet, consectetur adipiscing elit.
Beneath dolor sit amet, consectetur adipiscing elit.
Gemmae glorius dolor sit amet, consectetur adipiscing elit.

And we write too!
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nonummy dolor sit amet, consectetur adipiscing elit.
Beneath dolor sit amet, consectetur adipiscing elit.
Gemmae glorius dolor sit amet, consectetur adipiscing elit.

Let's talk!
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nonummy dolor sit amet, consectetur adipiscing elit.
Beneath dolor sit amet, consectetur adipiscing elit.
Gemmae glorius dolor sit amet, consectetur adipiscing elit.

We are social!
Twitter
LinkedIn
Facebook

We cook!
In our PR Kitchen we create the most delicious web apps. Experimenting our way to perfection!

And we write too!
On our writing you will find our opinion about UK, box here and the stories news about PIC.

Our beliefs
Interfaces about food and act like human beings.
This plus customers with love and respect.
Making things tangible and可爱.

Wireframesexistemparaevitartrabalhodesnecessário. Équasecomoum
rascunhodolayoutfinal.Comotodorascunho,écriadoparaqueaspessoas
consigamdarfeedbacksobreele,paraqueeleentãopossaserajustadoeir
paraasoutrasáreasenvolvidasnoprojeto.

Umwireframenuncaestá100%pronto. Justamenteporserumdocu- mento focado em colaboração e discussão, é importante que o UX designer o compartilhe com todos os membros do time (desenvolvedores, diretores de arte, gerente de projetos, cliente) e também com o usuário final. Muitas vezes, os wireframes já são suficientes para mostrar a interface para um usuário e colher feedback sobre os pontos fortes e fracos da solução proposta, antes mesmo de o layout final ser criado pelo diretor de arte.

A principal vantagem de usar wireframes em vez de layouts no Photoshop é a facilidade e agilidade em fazer ajustes, mudar tudo ou começar outra vez. É muito mais rápido e faz muito mais sentido. A própria aparência "de rascunho" dos wireframes (feito em tons de cinza, sem imagens ou conteúdo final) colabora para que as pessoas se sintam mais à vontade para dar feedback e sugerir melhorias. Afinal, é muito mais fácil você criticar um trabalho que foi feito rapidamente em poucas horas do que você pedir para um director de arte, que gastou dias polindo a interface, pixel a pixel, fazer grandes alterações.

Muitos gestores de projetos preferem esperar para que um wireframe esteja 100% aprovado pelo cliente e por todas as áreas envolidas antes de passar a documentação adiante para o diretor de arte e o programador começarem o trabalho. É o tal de processo de cascata, que mitiga o risco de refações e alterações após o momento em que o documento foi aprovado – apesar de não eliminar os ajustes de última hora pedidos pelo cliente ou causados por limitações técnicas na hora de implementar o produto.

A vantagem é que os programadores (tanto front-end quanto back-end) já podem começar seu trabalho após a definição dos wireframes. Por mais que o programador front-end não tenha o layout final, ele já pode ir pensando na arquitetura das telas, estrutura de pastas, arquivos de estilo e outras definições macro. Por outro lado, o programador back-end consegue entender a modelagem de dados necessária, a infraestrutura, os tipos de requisição e tráfego de informações que acontecerão no sistema.

## 3.4 ALTERNATIVAS AOS WIREFRAMES

Wireframes são uma ótima ferramenta na hora de demonstrar como uma interface deve funcionar e quais informações estão contidas nela. Além disso, são muito mais rápidos de serem pro em Photoshop.

uzidos (e alterados) do que os layouts

Durante muitos anos, o wireframe funcionou como peça essencial em projetos digitais de médio e grande porte. É a documentação em que todas as áreas se baseiam na hora de iniciar seus esforços - seja o diretor de arte, o programador front-end, back-end ou o redator.

No entanto, nos últimos anos surgiram outras fe que conseguem cumprir o mesmo papel que os wiref tempo e com um pensamento ainda mais ágil.

ramentas e entregáveis ames em muito menos

Até alguns anos atrás, em grandes empresas, era muito comum que em um projeto fossem desenvolvidos wireframes, layouts e depois protótipos navegáveis de uma determinada interface. Um processo de trabalho em cascata, em que cada entrega é validada com o cliente para que a etapa seguinte se inicie. Essa é uma forma segura de garantir que o visual designer só começará a trabalhar quando o wireframe tiver sido 100% aprovado, evitando horas desperdiadas em retrabalho.

Acontece que, no exemplo citado, o time acaba desenvolvendo 3 protótipos sequenciais. O wireframe nada mais é do que um protótipo, uma simulação de como a interface deve funcionar. O layout em jpg também é um protótipo, uma segunda simulação da mesma interface. E quando o UX designer utiliza uma ferramenta de criação de layouts clicáveis ou protótipos navegáveis, ele acaba criando um terceiro protótipo da mesma tela.

O pior: nada disso é aproveitado na hora de os desenvolvedores escreverem o código final. Essa documentação toda criada pelos designers acaba sendo usado apenas como referência para os desenvolvedores. E alguns projetos exigem um método mais ágil do que esse pensamento em cascata.

Foi com esse obstáculo em vista o Brasil e no mundo começaram a testa etapa do projeto.

ue alguns times de UX designers no outras alternativas para agilizar essa

Entre as alternativas mais comuns aos wireframes estáticos, estão:

## Wireframes colaborativos entre todos do time

Em vez de o UX designer ou arquiteto de informação desenhar os wireframes sozinho, sentado em sua mesa, é possivel pensar em um método mais colaborativoparaacriaçãodosmesmos:envolverodiretordearte,ogerente
deprojetos,oredator,ofront-enddeveloper,oback-enddevelopereoplanejadorecolocartodosjuntosemumasaladereuniãoparamontaremastelas
juntos–compapel,post-itsecaneta.

Cadaumcolocaseupontodevistaemcadadecisãotomada. Funciona
muito bem, especialmente para produtos com poucas telas. Em poucas
sessõesdeumaouduashorascada, épossíveldefinirofluxoprincipaldo
siteaváriasmãos. Amelhorparteéque,saindodareunião,todosjásabem
oqueositedeveconterejápodemcomeçaratrabalharnomesmodia,sem
precisaresperarqueoUXdesignerfinalizeumdeckdewireframesdevárias
páginasparaisso.

## Desenhosnopapel+guiasdeestilos

Emalgunscasosespecíficos,ficamaisfácildesenharempapeloconteúdo
datelaejápartirparaoPhotoshopcomodiretordearte.Adiferençaéque,
emvezdefazerolayouttelaatela,odiretordeartecriaapenasoselementos- chavedainterface,separadamente,comoemum styleguide.Oprogramador
front-endjuntaasduascoisas(osketchcomostyleguide),diretonocódigo.
IssotornaaetapadeUXearquiteturadeinformaçãomuitomaiscurta, e
tambémsimplificaotrabalhododiretordearte.Maséummétodoquenão
funcionamuitobemcasoositetenhaumsistemaback-endmuitocomplexo
(comouminternetbanking,porexemplo);algumasregrasprecisamserdocumentadasemmaisdetalhesparaosdesenvolvedores.

## Protótiposnavegáveis

Aopçãodecriarprotótiposnavegáveispodeserfeitausandoalgumaferramentadewireframingquepermitacriarlinksentreumatelaeoutra. No
final,emvezdeumwireframeestático,otimeconseguenavegarporumprotótipoclicávelquesimula,emvariadosníveisdefidelidade,comoainterface
finalfuncionará.

Close frames
Home
login
register
customise home
home - logged in
home logged 2
home logged 3
profile
profile - edit
profile - public
profile - photo
profile - preferences
news
news detail
events
events - detail
events - add
events - map
events - categories
towns / villages
towns / village data
gallery
gallery - detail
gallery - upload
groups
group detail
groups edit
messaging
compose
new message
sent messages
friends

easthampshire.org logo

Contact Us Help Site map RSS feeds All site search this site GO

LOGIN REGISTER FREE

Customise this homepa

Home
News
Events
Groups
Interactive Map
Towns & Villages
Links
Feedback

About easthampshire.org
you are not logged in.
by registering you get all this free:
- customisable content
- add events
- post messages
- leave comments

LOGIN REGISTER FREE!

MOST RECENT
EVENT NEWS COMMENT
1 lorem ipsum dolors
2 lorem ipsum dolors
3 lorem ipsum dolors
4 lorem ipsum dolors
5 lorem ipsum dolors
6 lorem ipsum dolors

NEWS
Latest local news from your area
1 lorem ipsum dolors
2 lorem ipsum dolors
3 lorem ipsum dolors
4 lorem ipsum dolors
5 lorem ipsum dolors
8 lorem ipsum dolors

EVENTS
Latest local events
1 lorem ipsum dolors
2 lorem ipsum dolors
3 lorem ipsum dolors
4 lorem ipsum dolors
5 lorem ipsum dolors
6 lorem ipsum dolors

Home
The widgets on the free / guest visitor home page will be able to move around the page, however on repeat visits the widgets will reset back to the original locationlayout

Figura3.6:ExemplodeprotótiponavegávelcriadopeloUXdesigner

Avantagemdessaalternativaéqueficamuitomaisfácilparaoclienteentendercomooprodutoiráfuncionar,semprecisarpercorrerextensaspági- nasdewireframesestáticos.Aparteruiméqueissonãodescartaotrabalho
inicialdepensarnaAIdapágina(ecomporolayout,casovocêqueiraque
omockuptenhaovisualfinal).Outropontonegativoéque,dependendoda
linguagemtécnicaemqueesseprotótipofoicriado,ocódigoacabanãosendo
aproveitadopelosdesenvolvedoresnahoradecolocaramãonamassaecriar
efetivamenteoproduto.

## UXdesigneraprendendoaprogramar

Essaéumaótimaalternativa,paraqueopróprioUXdesignermonteo
wireframeouprotótipousandoHTMLeCSS.Muitagentetemfaladohoje
emdiasobre“desenharnoprópriobrowser”,emvezdedesenharainterface
primeironoPhotoshop. Aparteboaéqueoprotótipoficamuitomaisrealistaeodesenvolvedorconsegueaproveitarumapartedocódigonofuturo.
AparteruiméoriscodeoUXdesignerficarmuitoentretidonaslinhasde
códigoeterpoucotempoparaseafastardaexecução,terumavisãoholísticadaexperiênciaeadvogarmaispelousuáriodoquepelainterface–que,
convenhamos,éoqueoUXfazdemelhor.

## UXedesenvolvedorfront-endcriandoprotótiposjuntos

Essepareceserumdosmelhorescaminhosparaondeostimesestãorumando–ou,pelomenos,ocaminhoquetemfuncionadoparamaistiposde
projetos.Cria-seumadupladeUXdesigneredesenvolvedoreelesdesenham
emontamjuntosoprotótipo. Tudoéfeitosemmuitanecessidadededocumentação,jáqueelessentamladoaladoediscutememtemporealasdecisões
dedesignqueprecisamserfeitas.Comoéoprópriodesenvolvedorfront-end
queestáescrevendoocódigo,100%deleéreaproveitadonoprodutofinal–
elesóprecisaadicionaroestilodepoisqueovisualdesignertiverdefinidoo
styleguidenoPhotoshop.

Umadasprincipaismotivaçõesnesseprocessodereinventarofluxode
trabalhodeumtimedeDesignéaconstataçãodequewireframesestáticos
nãotêmtidoumbomdesempenhoemcertostiposdeprojeto.Entreosprincipaisproblemasdeusarsomentewireframesestáticos,estão:

• Wireframesestáticosnãosãomuitobonsemrepresentarumdesign responsivo, a não ser que você desenhe 5 versões diferentes dele ou mais (uma para cada tamanho de tela);

- Wireframes muitas vezes tentam similar um comportamento que já é nativo do HTML e do CSS (ou da linguagem de programação na qual o produto final será criado);

- Alterações no wireframe de alta fide para serem feitas do que no código, p mestres e outras táticas.

dade podem levar mais tempo or mais que você use elementos-

É claro que não existe uma resposta definitiva para a melhor alternativa aos wireframes. Possivelmente, eles nunca serão completamente substituídos, já que funcionam e continuarão funcionando muito bem para determinados projetos, times e métodos de trabalho. Se você está começando agora a se aventurar pelo mundo de User Experience, os wireframes continuam sendo o caminho mais seguro e razoável de documentar o seu trabalho.

Cada uma dessas alternativas listadas anteriormente tem seus prós e contras. Cabe ao UX designer e ao desenvolvedor entenderem a ferramenta que funciona melhor para aquele projeto, para aquele prazo, para aquele time e para aquele cliente. É essa capacidade de se adaptar a diferentes contextos que diferencia os melhores profissionais de UX no mercado.

## 3.5 AS VANTAGENS DOS PROTÓTIPOS

Protótipos são versões interativas dos wireframes, onde é possível clicar ou interagir com algumas partes da tela para similar como será o seu funcionamento –mesmo que ainda a funcionalidade ainda não tenha sido implementada corretamente. É como se fosse um rascunho do trabalho que depois será realizado pelo desenvolvedor front-end.

Como mencionado anteriormente, a criação desse tipo de protótipo navegável pode ter algumas vantagens em relação aos wireframes estáticos:

## Experiência de navegação

A possibilidade de navegar pelo protótipo faz muita diferença na hora de "sentir" como o produto final funcionará. Ele simula o que acontece a cada clique, a cada interação - resultado esse, que só seria possivel depois que o projeto já tivesse sido programado por um desenvolvedor front-end.

## Documentos mais enxutos

Diferente dos wireframes estáticos, os protótipos permitem que você represente vários estados diferentes da interface em uma mesma página. Quando o UX designer cria um wireframe em PDF, cada novo elemento que surge na tela (mesmo que ele não represente uma página separada na estrutura do site) precisa ser documentado em uma página diferente do documento. Já os protótipos permitem que você veja os elementos em funcionamento no próprio contexto onde eles aparecem, fazendo com que o documento final seja bem mais enxuto do que os extensos PDFs com wireframes estáticos.

## Apresentação para clientes

Designers e desenvolvedores estão acostumados a receber um wireframe em PDF e abstrair o fato de que aquele documento é apenas uma representação de como a interface irá funcionar. Com os anos de profissão, eles se acostumam a conseguir visualizar como aquele wireframe se materializará uma vez que o produto começar a ser construído na linguagem final – seja um site em HTML, um aplicativo para iOS ou um game.

Mas muitos clientes não estão acostumados a lidar com wireframes no dia a dia. Protótipos contribuem para que os clientes entendam melhor a proposta e agilizam a aprovação do trabalho. Nas reunições de apresentação de trabalho, basta o UX designer pilotar a navegação e interagir com o protótipo na frente do cliente para que ele entenda como a interface funciona.

## Ferramentas de fácil aprendizado

Existem várias ferramentas disponíveis no mercado para se criar protótipos navegáveis. Além de não precisar conhecer nada sobre HTML ou CSS para prototipar um site usando esses softwares, por exemplo, você consegue aprender a dominar os recursos da ferramenta já no primeiro dia de trabalho. Normalmente, as empresas que fornecem esses softwares de prototipagem também disponibilizam tutoriais e dicas em seus sites.

---

No Brasil, uma das ferramentas mais populares de prototipação é o Axure, mas há uma porção delas - cada uma com um uso específico.

## GOSTA DESSE ASSUNTO?

Se você tem interesse em saber mais, acesse http://fabricio.nu/ ferramentas para ver mais ferramentas de prototipação e wireframe.

## Designers e programadores menos irritados

Abrir um documento de wireframe em PDF e percorrer todas as páginas lendo todas as anotações escritas pelo UX designer pode ser um trabalho maçante. Quando o documento é muito extenso, há ainda o risco de os diretores de arte, programadores e clientes não se atentarem aos detalhes e acabarem negligenciando alguns pontos importantes. Os protótipos acabam deixando a experiência de navegar pelo trabalho do UX designer mais interativa, menos cansativa e mais próxima da realidade.

## Aprender enquanto desenha

Para o próprio UX designer, a prototipagem é um aprendizado interes- santissimo de design. À medida que você vai gerando o protótipo e testando aquilo que acabou de desenhar, fica mais fácil visualizar as falhas e corrigi las no decorrer do processo. Quando você desenha um menu, por exemplo, já consegue testar se o menu está "usável" na mesma hora – algo que é quase impossível prever quando você está criando wireframes estáticos e não-interativos.

## Mais facilidade para testar com usuários

Com o protótipo em mãos, é muito mais rápido conseguir colocá-lo na frente de usuários reais para testar o produto. Em alguns casos, você pode até mandar o link do protótipo para alguém testar remotamente, colhendo feedback quase imediato sobre aquilo que está sendo desenhado.

## 3.6 COMO DECIDIR ENTRE PROTÓTIPOS E WIRE-FRAMES

Nos últimos anos, os times de UX design passaram a incorporar protótipos em seu fluxo de trabalho com muito mais frequência. Apesar de os wireframes estáticos continuarem firmes e fortes, os protótipos surgem para responder a algumas necessidades que se tornaram essenciais no dia a dia do UX designer.

Sejam os protótipos criados diretamente em HTML + CSS + JS ou por uma ferramenta de prototipagem, como explicado anteriormente, os objetivos da criação de protótipos funcionais continuam os mesmos: representar links entre telas, detalhar as interações entre um estado e outro do sistema, ser mais fiel na representação da interface e facilitar os testes com usuários.

Wireframes e protótipos são todos membros de uma mesma família. Enquanto os wireframes representam a interface com menor fidelidade, os protótipos representam interfaces de forma muito mais próxima do produto final.

## Qual critério usar para decidir entre um e outro

Na verdade, é no plural: critérios. Segundo este artigo do UsabilityGeek (http://usabilitygeek.com/when-to-prototype-when-to-wireframe-fidelity) , existem vários aspectos que devem ser levados em conta nessa decisão. Veja a seguirumaversãoadaptadadalista,mostrandooscritériosquemaispesam
nahoradedecidirentrewireframeseprotótiposfuncionais.

Maisimportantedoquetentardizerseprotótiposinterativossãomelhoresoupioresdoquewireframesestáticos,oobjetivodestalistaésomente
clarearerelembrarpontosquepodempassarbatidosnahoradefazeressa
escolha.Pararummomentoantesdeoprojetoiniciarparafazeressadecisão
émuitomelhordoquesimplesmentesairfazendoumououtroedepoisse
arrependernomeiodocaminho.

## Budget

Primeiro,éimportantedeixardeladoaafirmaçãocegaquedizqueprotótiposgastammaishorasparaseremfeitosdoquewireframesestáticos.

Depois,éprecisolevaremconta:

• Osoftwarequevocêpretendeusarparacriarcadaumdeles;

• Oprofissionalqueiráfazê-lo;

• Ahabilidadedoprofissionalcomtalferramenta;

• Oníveldedetalhamentoquevocêquerqueoprotótipotenha.

Apartirdomomentoemquevocêtemvisibilidadedessesquatroaspectos,opróximopassoéestimarashorasnecessárias. Játiveexperiênciasótimasemqueumprotótipoeracriadodiretamentenocódigoporumadupla
deUXdesigner+desenvolvedorfront-end,emmuitomenoshorasinvestidas
doqueseodesignerestivessecriandosozinho.Tambémjávicasosnosquais,
naausênciadealguémcomhabilidadeemcriaçãodeprotótipos,amelhor
soluçãoeradocumentarwireframesestáticosilustrandopassoapassocomo
ainteraçãoacontece.Asduasopçõespodemfuncionarbem,desdequetodos
dotimeestejamcientesdequalseráutilizada.

## Fasedoprojeto

Umoutroaspectoparalevaremcontaéomomentoemqueoprojetose
encontra.

---

• Momentodegeraçãodeconceitos:seotimedesejacriarváriasversões
diferentesdeumamesmaideiaparatestarqualfuncionamelhor,wireframesdebaixafidelidadepodemgarantirmaisrapideze“desapego”à
soluçãocriada.Issopodeserfeitoatémesmousandopapelecaneta.

• **Momentodevalidaçãodeconceito:** seotimejáoptouporumcaminhocriativoeagoradesejatestarafundoseelefunciona,protótipos
dealtafidelidadetendemasermaisefetivosnahoradevalidarcom
usuáriosreais.

• **Momentodeprodução:** se o produto já está sendo desenvolvido, a
decisãofica, namaiorpartedasvezes, acritériodotimedeprogramadores. Qualomelhorjeito,paraeles,dereceberadocumentação?
Altaoubaixafidelidade?Estáticoouclicável?

## Complexidadedainterface

93 Broadway Lenox Ave Port Morris Barre Riverside Park W 116th St E 116th St 5th Ave East Harlem 278 Wards Island W 97nd St E 106th St Upper West Side FDR Drive Manhattan Solomon R. Guggenheim Museum 278 20th Ave 21st Ave Ditmars Blvd Hazen St W 72nd St The Lake Lincoln Square Central Park Upper Ea 3rd Ave 30th Ave 31st St 278 W 57th W 59th St The Museum of Modern Art Main St Astoria 34th St Steinway St 44th St W 46th St

Quandooprodutoqueestásendocriadodependefortementedeumainteraçãoespecífica(exemplo: arrastarobonequinhodoGoogleMapssobre umaruaparaativaroStreetView),talvezomelhorjeitodesaberseessainteraçãofuncionasejacriandoumprotótipofuncional. Quandovocêtenta
documentaressemesmotipodeinteraçãoatravésdewireframesestáticos,é
precisosermuitomaisdetalhistacomoqueaconteceemcadaumdospassos
(sejaatravésdeumadescriçãoemtexto,sejaquebrandoodesenhodainteraçãoemváriosquadros).

Masseotrabalhoépuramentedearquiteturadeinformação–organizar
conteúdo,navegaçãoemostrarhierarquiaemcadatela–talvezowireframe
estáticoacabesendomaisefetivoesimplesdeserdesenvolvido.

Leveemcontatambémseodesignéresponsivoounão.Dependendoda
suaescolhadeferramenta,serãonecessáriashorasamaisouamenospara
representarcomoainterfaceseadaptaparadiferentesresoluçõesdetela.

## Sofisticaçãodaaudiência

Paraquemadocumentaçãoseráapresentada?

Normalmente,opúblicointernodaagênciaouempresaondevocêtrabalhacostumatermaisfacilidadedeabstrairwireframesestáticoseentender
comoasinteraçõesfuncionamsemanecessidadedeumprotótiporealistada
interface.

Masacoisapodemudarumpoucodefiguranocasodeclientes(dependendodamaturidadeeexperiênciaqueelestêmemlidarcomdocumentação
deUX)edeusuáriosfinais(algumaspessoaspodemterdificuldadedeentenderqueaqueledesenhoquevocêestámostrandoparaeleséarepresentação
deumainterfacedigitalanimadaeinterativa).

Eseoobjetivoéencantaroclienteparaconvencê-loacompraroprojeto,
certamenteosprotótiposcausammelhorimpressão.

## Ferramentashíbridas

Umaoutrasaídainteressanteéutilizarumaferramentahíbrida,quepermitecriartantowireframesestáticosquantoprotótiposinterativos.OAxureé
umbomexemplo:vocêsóadicionalinkseinteraçõesentreastelassequiser.
Issoaliviaopesodessa“decisão”entrewireframesestáticoseprotótipose
aindapermitequeotimemudedeumtrilhoparaooutronodecorrerdo
projetocasonecessário.

---

## 3.7 Comunicando ideias com rabiscoframes

Privacy Bar Manage
View As

Who can see this update? View All By List
Quick Find

NAME
NAME
NAME

Aexpressão“rabiscoframe”éumamisturabemhumoradadotermosketch
(esboço,rabisco)comojáconhecidotermowireframe.Emmuitostimesde
desenvolvimentojásetornouparteessencialdoprocessodedesenhodeinterfaces,especialmentenaquelemomentodoprojetoemqueasideiascomeçam
atomarformaesairdoetéreomundodoPowerPoint.

---

"Sketching permite que exploremos o problema e definamos a solução ao mesmo tempo. A técnica ajuda a definir melhor o nosso entendimento do problema, ao mesmo tempo em que nos ajuda a pensar nas possíveis soluções.

Enquanto nós rabiscamos aquilo em que estamos pensando, novas ideias emergem. A ambiguidade e a falta de detalhes em um sketch geram novas ideias. Aqui, ambiguidade é uma coisa boa, porque nós automaticamente começamos a preencher os espaços vazios na nossa cabeça. É isso que faz do sketch uma técnica "generativa": ela captura a ideia que nós já temos e ao mesmo tempo desperta novas ideias.

Ao rabiscarmos novas soluções para o problema, podemos explorá las sem necessariamente nos comprometermos a nenhuma delas. Isso nos dá novos insights e novas perguntas para serem respondidas. Sketching é essencialmente um exercício de brainstorm."

por Lennart Hennigs, Smashing Magazine

Veja mais em http://www.smashingmagazine.com/2013/06/24/sketching-for-better-mobile-experiences/

Alguns profissionais usam os rabiscoframes como uma espécie de "rascunho" do wireframe final. Depois da primeira rodada de desenhos e discussões com o time, aí sim o UX designer "passa a limpo" o material em forma de wireframe mais formal, feito através de algum software.

Mas em outros casos, não: o próprio rabiscoframe acaba sendo a documentação final para as outras áreas. Quando o time está mais entrosado e acostumado a trabalhar em conjunto e quando não há a necessidade de formalizar o trabalho do UX designer em um wireframe completo, o próprio sketch é usado pelos diretores de arte, programadores e gerentes de projeto para darem sequência ao trabalho.

A questão é que muita gente ainda tem receio de assumir o rabiscoframe como etapa da metodologia, seja por não dominar a técnica de desenho, seja por considerar o sketch algo muito imaturo e muitas vezes infiel ao resultado final da interface.

---

## 3.8 BOAS PRÁTICAS PARA RABISCAR

Existem vários artigos disponíveis online sobre boas práticas na hora de criar seus rabiscoframes. Muitas pessoas têm resistência a incorporar os sketches em sua rotina de trabalho, simplesmente por não dominarem a técnica de desenho. Mas a verdade é que você não precisa ser um Da Vinci para conseguir traduzir suas ideias no papel.

## Não saber desenhar não é um problema

O primeiro passo para começar a rabiscar uma ideia é se desprender da vergonha de não saber desenhar. Muita gente não nasceu com esse dom e, assim como eu, sempre tirou notas baixas nas tarefas de desenho livre da escola. A questão é que isso tem pouca importância na hora de rabiscar uma tela. Saber expressar ideias no papel se tornou uma questão de sobrevivência para quem quer evitar discussões pouco produtivas, em que cada um dos participantes tem uma imagem diferente na cabeça. O desenho é feito para ilustrar informalmente uma ideia e iniciar uma discussão. E so. Com o tempo, os "rabiscadores" vão pegando a prática e perdendo a vergonha. Além disso, os rabiscoframes normalmente circulam apenas entre os próprios membros do time. Se você tem vergonha de mostrar uma ideia para um membro de seu próprio time, então o problema não é a falta de habilidade com desenhos.

## O rabiscoframe não é uma entrega

Os rabiscos raramente são entregues ao cliente ou a alguém da diretoria da empresa/agência onde você trabalha. Eles servem apenas para os próprios designers e desenvolvedores entenderem o que se espera de determinada interface, e algumas vezes não eliminam a necessidade de wireframes mais detalhados sobre seu conteúdo e funcionamento. Normalmente, os rabiscos duram apenas alguns dias e, à medida que as soluções desenhadas vão se aperfeiçoando, são deixados de lado e substituídos por protótipos mais completos.

## O sketching é um exercício coletivo

Poucas vezes fiz um rabiscoframe sozinho, sentado em minha mesa, tentando ilustrar algo que já estava decidido. A tática do lápis e papel nor- malmentesemostranecessárianasdiscussõescomoutrosparticipantesda
equipe, nomomentoemquecomeçamasurgirasprimeirasdúvidasedivergênciasdeopiniõessobrecomodeterminadateladevesecomportar.Sea
soluçãojáestádefinidaevocêsóprecisadocumentá-la,asugestãoéirdireto
aossoftwaresdewireframeouprototipagem.

## Aborrachaédispensável

Sevocêsentevontadedecorrigiralgoqueacaboudedesenhar,ésinalde
quejáestáemumestágiodedetalhamentoposterioraorabiscoframe. Ele
exigeumaboadosedeabstraçãodetodasaspartesenvolvidas. Discussões
como“menuhorizontalouvertical?”ou“imagemnaesquerdaounadireita?”
devemsertomadasmaisparafrente,oudiretonoPhotoshop.

## Tenhasempreumcadernoàmão

Terumcadernoàmãoemqualquerdiscussãooubrainstorméumaboa
dicaparacomeçarafazerdosrabiscoframesumhábito. Instigueodesigner
arabiscaraquiloqueeleestásugerindoeofereçaaeleseuprópriocaderno.
Cadernosfuncionammelhordoquefolhassoltas, jáqueelastendemase
perdernomisteriosoburaconegrodasnossasmesas.Enofim,háumcerto
orgulhoemguardaraquelecadernocheioderabiscoscriativos.

## NãotentepintarumquadrodeRembrandt

Segundo este artigo de Owen Shifflett (http://viget.com/inspire/
5-things-to-consider-whilst-sketching) , o propósito inicial de um sketch
nãoéproduzirumaobradearte. Naverdade,focarmuitonosdetalhesdo
sketch pode atrasar seu progresso e ainda fazer com que você pense nos
detalhes mais do que deveria e se esqueça de olhar para o que realmente
importa:conceitoedireção.Fazerumsketchmenosbemfinalizadotambém
facilitaemoutroponto:aspessoasficammaisàvontadeparadarfeedbacke
alteraroseudesenhoquandoelenãoestáfinalizadooupolido.

## Façasketcheslogo,ecomfrequência

Depoisqueossketchesforamaprovadospeloclienteepelotime,éhora de refinar o que você fez. Continuar trabalhando com sketches por mais um tempo ajuda a evitar a síndrome do "ficar mexendo caixinhas no Photoshop até desmaiar". Além disso, essa mudança do mouse para o lápis e papel pode ajudar bastante a evitar bloqueios criativos. O principal é ficar o mais tempo possível longe do computador – ele é uma grande ferramenta, mas também pode acabar sugando sua alma.

## Anote tudo

É importante que seu sketch comunique detalhes o comportamento da interface, já que, visualmente falando, eles não são desenhos tão refinados assim. Anote na margem do papel ou crie um sistema de legendas. Isso também pode ajudá-lo a lembrar de mais detalhes quando olhar para os sketches no outro dia.

## Crie storyboards sempre que possivel

Contar histórias significa levar os espectadores do ponto A ao ponto B. Storyboards são ótimos para isso. Nesse ponto, é importante ser consistente e reutilizar elementos que já tenham sido desenhados, para que a pessoa que está vendo o sketch não pense se tratar de um novo elemento. Repare como cartunistas utilizam enquadramento e posição dos personagens para adicionar um pouco de contexto e intenção em cada quadro. Isso também pode ser usado na hora de rabiscar interfaces ou animações.

## Adicione cor somente quando fizer sentido

Colorir seus sketches pode deixá-los mais bonitos, mas não é preciso comprar um estojo de lápis de cor e sair pintando tudo o que você desenha. Use as cores para dar destaque a um elemento importante e que realmente mereça destaque.

A dica, no fim das contas, é saber adaptar a sua ferramenta às necessidades do projeto em questão. Você não precisa ser um especialista em wireframes ou um desenhista profissional para se tornar um UX designer. O mais importante é o pensamento que existe junto com o desenho, e a clareza na hora de comunicá-lo para outras pessoas.

---



---

Capítulo 4

# Aboaevelhausabilidade

Usabilidadeéumtermousadoparadefinirafacilidadecomqueaspessoas
podemutilizarumaferramentaouobjetopararealizaremumatarefa. No
campode *Human-ComputerInteraction* e UserExperience,usabilidadenormalmenteserefereàsimplicidadeefacilidadecomqueumainterface(site,
aplicativo,programadecomputador,gameetc.)podeserutilizada.

Otermoganhoumaisnotoriedadenosúltimosanos,àmedidaquemais
profissionaiseempresasforamsendoenvolvidosnoprocessodecriaçãode
interfaces.Hojeemdia,ausabilidadejáévistacomoumfatordecisivopara
osucessooufracassodeumprodutodigital.

---

## 4.1 SIMPLICIDADE NÃO É SIMPLES

Pense na interface do controle remoto da sua TV. Uma série de botões agrupados em diversas áreas, cada um com uma função diferente. Apesar dos agrupamentos e do uso de formatos e cores para diferenciar os botões mais usados, ainda assim existe informação em excesso.

Agora pense na mesa de dentro de uma sala de estar. Um controle para a TV, outro para o DVD Player, outro para o aparelho da TV a cabo. E pense que uma mesma pessoa precisa saber usar todos esses controles para realizar tarefas simples como gravar um programa ou comprar um filme no pay-perview.

Chegar a uma solução simples de usabilidade é um processo bastante complicado. São necessários vários e vários rounds de explorações de design, além de discussões sobre priorização das funções que são mais importantes, quais podem ser eliminadas, escondidas ou despriorizadas. A vantagem das interfaces digitais é a possibilidade de exibir e esconder botões à medida que o usuário avança no fluxo.

Simplificar é um processo tão difícil e repetitivo que muita gente diz que "design nunca acaba". Sempre ha a possibilidade de otimizar mais alguma área, diminuir a carga cognitiva sobre o usuário ou alterar o visual dos elementos da interface para que eles pareçam mais simples de usar.

Giles Colbourne trata justamente disso em seu livro Simple and Usable (http://www.simpleandusable.com) . O autor propõe 4 modelos para soluçionar o excesso de informação e conseguir desenhar interfaces realmente simples.

---

Remova Esconda Organize Mova

**Remova:** livre-sedequalquercoisaquenãosejaessencialparaaaplicação. Issopodesignificarremoverconteúdo, também, assimcomoalinguagemquevocêusanoslabelsdenavegação.

**Organize:** distribuaoselementosdainterfacedeformaqueelesseencaixememgruposlógicos. Issopodesignificartantosebasearnosmodelos
mentaisdequemusa,quantoagrupá-losempadrõesdeinterfacequesejam
maisfamiliares.

Esconda:deixeapenasositensmaisimportantesaoalcance(fazendocom
queelessejamóbvios),eescondaosoutros,deixando-osacessíveisapenaspor
navegação.

**Mova:** coloque algumas das funcionalidades em outro dispositivo ou
outrolugar,deformaqueainterfacenãofiqueresponsávelpormostrartodas
asinteraçõespossíveisdeumavezsó.

Naspróximasseções,vocêconferealgunsprincípioseboaspráticasconhecidosquandooassuntoétornarinterfacesdigitaismaisusáveisparaos
consumidores.

---

## 4.2 Ofereça informações em pequenas doses

Apesardeseremosanimaismaisinteligentesdoplaneta,ossereshumanos
têmumacapacidadelimitadaemrelaçãoàquantidadedeinformaçãoque
conseguem(ouestãodispostos)adigerirquandoestãoocupadosrealizando
umatarefa.Dependendodanaturezadessatarefa,éimportantegarantirque
ainterfacenãoestejabombardeandoousuáriocominformação,paraqueela
consigaserrealizadacomsucesso.

Quantasvezesvocêjánãoacessouoseuinternetbankingeficouvários
segundosaliparado,tentandoentenderondeéquevocêprecisaclicarpara
conseguirvisualizarseuextratobancário? Comopassardotempoecom
oenvolvimentodeprofissionaisdeUXnessetipodeprojeto,essasmesmas
interfacespassaramaserredesenhadasparafacilitaroacessoàinformação
eàsferramentasqueousuárioestáprocurando. Hojeemdia,paracitaro
mesmoexemplo,écomumqueoextratodesuacontajáapareçanaprópria
telainicialdoseuinternetbanking,assimquevocêterminadefazerologin.
Informaçõesqueaspessoasbuscamcomfrequênciasãopriorizadas,semnecessidadedemuitoscliquesparasechegaratéelas.

---

TYPICAL APPLE PRODUCT...

TOUCH

A GOOGLE PRODUCT...

FIND

YOUR COMPANY'S APP...

FIRST NAME:
LAST NAME:
SSN:
ID:
FT/PT:
TYPE CD:
TQP STAT:
VER:
CAT CD:
CITY:
STATE:
ZIP:
ORD #:

4 - K
AA2-
DK9B
KKA?
CN3
AA-9

NEW

DEL

OKAY APPLY SAVE UNDO HELP DELETE EDIT

SELECT BROWSE ERRORS

STUFFTHATHAPPENS.COM BY ERIC BURKE

---

Naverdade, apresentarinformaçõescomsimplicidadeenoexatomomentoemqueousuárioestáprocurandoporelajásetornouquestãoprimordialnahoradediferenciaraplicativoseprodutosdesucesso.

Atentaçãodeadicionarlinkseconteúdoemexcessonasinterfacesébastantegrande.Afinal,vocêquerofereceromáximodeopçõesparaousuário
equerqueoseuprodutosejaomaiscompletopossívelparasediferenciarda
concorrência.

Masaregraaquié **simplificar, reduzir** e **oferecerinformaçõesemdoses
digeríveis,** paraqueaspessoasnãosesintampressionadasatomaremdecisõesdemasiadasemváriospontosdiferentesdajornada.

• Qualaaçãoprincipalquevocêquerqueoseuusuáriofaçanessemomento?

• Quaissãoasaçõessecundárias? Dentreelas, quaisvocêpoderiaremoversemprejudicaratarefaqueousuárioquerrealizarnaquelemomento?

• Qualomínimodeinformaçãoqueousuárioprecisasaberpararealizar
aquelatarefa?Qualamenorquantidadedetextopossível(commenor
númerodecaracteres)paraexplicaraquiloparaele?

• Asimagensquevocêpretendecolocarnainterfaceestãocontribuindo
paraqueousuáriorealizeatarefacommaisfacilidade? Comoessas
imagenspodemserrepensadaspara,alémdocaráterdecorativo,assumiremtambémumpapelinformativoeajudá-lonofluxo?Cuidado
tambémcomexcessodebannerseoutrosboxesquetentamchamara
atençãodousuárioparaalgoquenãoénecessariamenteessencialpara
realizaratarefaqueeledeseja.

• Qual o mínimo de elementos de navegação que você precisa ter na
telanaquelemomento? Omenuprecisaficarexpostootempotodo?
Daquela página, quais as outras páginas que o usuário pode querer
acessar? Umadicaimportantenessepontoéolharparaasmétricase
veremquaislinksosusuáriosestãorealmenteclicando.Considereexcluirouesconderoslinksmenosclicadosparadeixarainterfacemais
simples.

---

## 4.3 Crie hierarquia na página

13:25
airbnb
Sign Up Log In
Beautiful Nice Studio front beach**
$68
Apartment - Entire home/apt
Book It
Contact Host
Description Details Amenities
Near the Promenade des Anglais (5 minutes from the sea) and
central hyper equipped with everything that is needed and very
clean, flexible arrival time and NO DEPOSIT to give (very important)
because it takes time to recover . rapid response
Read More
Reviews (1/131)

Hierarquianadamaisédoqueusardiferentesestilosvisuaisparaoselementos
datelademodoapriorizaroqueémaisimportante.

Atravésdeumaboahierarquia,épossívelguiarosolhosdousuáriopelo
caminhoquevocêdesejaqueelepercorra. Qualaprimeiracoisaquevocê
querqueeleleiaouvejaassimqueentrarnoseusite?

---

Etsy What are you looking for? Search Sign In Cart 0
Art Home & Living Jewelry Women Men Kids Vintage Weddings More

Shop directly from people around the world.

Alana Little of makeplenotwar
California, United States

126 items

Recent Favorites
Discover finds from around the marketplace.

Figura4.1:Etsy.com:hierarquiaclarausadaparachamaratençãoparaoslogan.Emumafraseousuárioentendeapropostadosite.

Umdosdesafiosnodesignparainterfacesdigitaisémanterahierarquia
claraàmedidaquenovoselementossãoadicionadosnatela.Vocêjádeveter
passadoporisso:oseuclientepedeparaadicionarmaisdoisoutrêsdestaques
napáginainicialdosite,alémdeumbannereumachamadaparaumapromoçãoespecial.Masénessemomentoqueahierarquiadapáginacomeçaa
seperder.

Vejaoexemplodahomepagedomsn.com. Alémdefaltadehierarquia
claranotamanhodasfonteseoexcessodeelementosnoheaderdosite,a
adiçãodeumbannernadireitadatelacomeçaacriarconflitovisualcoma
mancheteprincipaldahomedosite.

---

Ou ainda o exemplo do magazineluiza.com: a página inicial possui 6 grandes chamadas para o usuário clicar, cada uma com um tamanho e estilo diferente de fonte. Qual delas é mais importante?

---

nossas lojas. tenha sua loja central de atendimento compre pelo telefone (11) 3508-9900 100% seguro 0
magazineluiza.com vem ser feliz
procure por código, nome, marca...
faça seu login ou cadastr-se
seus pedidos seu espago
ar e ventilação áudio auto bebês beleza e saúde brinquedos cama, mesa e banho câmeras casa e jardim celulares eletrodomésticos eltroportateis
esportes ferramentas gamesirmática móveis perfumaria relógios suplementos tv e video utilidades domésticas todos ce produto
ganhe um prédio confira frete grátis *nas compras a partir de R$99.00 regras 12% em todo o site * nas compras à vista a partir de R$179.90 regras
domingo é dia de môveis!
12% de desconto à vista
+ Frete Grátis
+ Montagem Grátis
*O frete é válido para os entadores de SP e PJ nas ocompras a partir de R$99.00. A montagem grátis valida para as oidades que possuem lojar físicas. Desconto válida has compras a partir de R$179.90
guarda-roupa rack cozinha itatialia cama box cozinha Glamy smart tv notebook
Mãe morango coração
Mostre para sua mãe o porquê que ela mora no seu coração, faça uma homenagem pra ela agora! Clique aqui.

Exemploscomoessesãocomunsnahoradedesenharahomepagedeum
site,porexemplo. Seucliente(oumesmootimeinternodolocalondevocê
trabalha)começaapedirparaadicionarmaisemaischamadasparaseções
diferentesdosite,paraprodutosqueforamlançadosouparanovidadesque
elesqueiramdivulgarparaosvisitantesdosite.

Aconteceque,quandotudoéimportante,nadaacabasendoimportante.
Éamesmacoisadoquechegarnaprateleiradeumafarmáciaetentarescolherumshampooparaoseucabelo(principalmentesevocêforhomem).
Sãotantasopçõesquevocêficaparalisado,semsaberexatamentequaldelas
escolher.

Algumasboaspráticasparaconseguirumaboahierarquianaspáginas
são:

• Organizeitenssimilarescomvisualsimilar.

• Eviteinconsistências.Utilizeomesmoestilovisualparaelementosque
têmfunçõesparecidas.Estilosvisuaisinconsistentescausamconfusão
paraousuárioedeixamainterfacepoluída.

---

• Usecoresparadiferenciarasaçõesprincipais. Useocontrasteaseu
favorparaatrairoolhardousuárioparaaaçãoquevocêquerqueele
faça.

• Categorize. Agrupelinksportemas,emvezdesimplesmentelistá-los
natela.

• Usetamanhosdefontediferentesparacriarhierarquianapágina,mas
limiteaquantidadedetamanhosdefonteparamanterharmonia.

• Tenhaumbomequilíbriodetextoseimagens.Lembre-seque,dependendodatarefaqueousuárioestárealizando,imagensnemsempresão
bem-vindas. Seeleestánomeiodeumprocessodepagamento,imagenspodemacabartirandoofocodaaçãoprincipalquevocêquerque
elefaça.

---

## 4.4 Diga ao usuário o que fazer a seguir

13:25
TOPSHOP
BAG (1)
MOTO DIRTY RASPBERRY
SUPERSOFT LEIGH JEAN
£38.00
ITEM ADDED TO BAG
GO TO CHECKOUT

Figura4.2:E-commerceTopShopsinalizaclaramentequandoumiteméadicionadoaocarrinhoesugereaousuárioqueprossigaparaocheckout–o
próximopassodofluxodecompra.

---

Umerrocomumdesiteseaplicativosécriarruassemsaídaparaosusuários.
Tenhacertezadeque,emtodaequalquerteladoseuproduto,estáclaropara
ousuáriooqueeledevefazeraseguir.Quandoousuáriosevêsemopções,é
comumqueeleabandoneositeoutenhaquevoltarparaapáginainicialpara
tentarencontrarnovamenteoqueeleprocurava.

Umexercíciointeressanteparaotimizarausabilidadedoseuprodutoé
olharparacadaumadastelascomasseguintesperguntasemmente:

• O usuário sabe onde está? A tela comunica com clareza em que
página/site/passodofluxoeleseencontra?

• Ousuáriosabeoquefazeraseguir?Aaçãoprincipalestánítidaosuficiente?

• Obotãoondeeuqueroqueousuáriocliqueestáclaro? Otextodo
botãodáaousuárioalgumadicadoquevemaseguir?

• Seessatelaéumateladeconfirmaçãonofinaldeumfluxo,euestou
aproveitandoparasugerirqueousuáriofaçaalgomais,aumentandoo
tempodenavegaçãoeoníveldeengajamentodelecomoproduto?

Nome de botão vago
Nome de botão claro
ENVIAR
CRIAR MINHA CONTA

Figura4.3:Nomesdebotõesmaisclarosajudamousuárioaentendermelhor
aconsequênciadaação.

Umproblemaclássicodeváriasinterfacesexistenteshojeéatentativade
daropçõesdemaisaousuárioeacabarconfundindo-o. Umacoisaparase teremmentenahoradecriarumdesignéquecadadecisãoquevocêforça
ousuárioatomarsignificaalgunssegundosamaisdeesforçocognitivo.Ele
precisaolharasopçõesdisponíveis,entenderoquecadaumadelasfaz,eentão
decidirqualéaopçãodesejada.

Passe o mouse para ampliar
Forno de Micro-ondas LG MH7043R com 24 Programas, Função Grill,
Eco ON, I-Wave, Descongelamento, Trava para Crianças e Frente
Espelhada - 30 L - Prata
(Cód. Item 2933714)
(Cód EAN 7893299430251)
Outros produtos LG
Ainda não avaliado Faca uma Avaliação
Selecione
Selecione uma opção
De: R$ 599,90
Por: R$ 364,95
Por: R$ 354,00
com desconto
ou até 12X de R$ 29,50
sem juros
Adicionar a
Lista de Casalimento
Economia de: R$ 245,90
por R$ 328,46 no pagamento em
boleto bancário ou débito online.
Calcule o frete e o prazo de entrega estimados para sua região. Dúvidas? Clique aqui.
Informe seu CEP:
OK > Não sei meu CEP
O Que Achou?
3 11 0
Eu Amo Eu Quero Eu Tenho
Compartilhe
4 0 4
Facebook Twitter Compartilhar
Seguro de Garantia Estendida Original
Comprar com seguro
Sem Seguro de Garantia Estendida Original
Video Explicativo da Garantia
Comprar com Garantia
> Ler Regulamento Li e aceitto

Vejaoexemplodapáginadeprodutosdentrodositepontofrio.com:ela
oferece5opçõesdiferentesaousuáriodoquefazeraseguir.

Quandoousuárioclicaem Comprar (teoricamente,omaiorbotãoda
tela,oquelevaacrerqueéondeeledeveclicar),ositeexibeumamensagemde
errodizendoqueéprecisoselecionarumavoltagemparaomicro-ondasantes
deadicionaraocarrinho.Masnolayoutdapáginao Selecione ficaperdido
nomeiodetantasoutrasinformaçõesemuitodistantedobotão Comprar.
Infelizmente,arelaçãonãoestáclara.

---

The page at www.pontofrio.com.br says:
Você não escolheu qual produto você quer comprar.
Por favor selecione uma opção.
OK

## 4.5 Dê feedback sobre o estado do sistema

Clarezaéapalavradeordemaqui. Ousuárioprecisaentender,aqualquer
momento,oqueestásepassandocomosistema. Seelepreencheuumformulárioincorretamente,porexemplo,éprecisoqueainterfacecomunique
issocomclarezaparaele. Inclusivedandoinstruçõesprecisassobrecomo
resolveroproblema.

Error Copying File or Folder

Catastrophic failure

OK

Figura4.4:Falhacatastrófica.Inclusivenaexperiênciadousuário.

Aregraessencialdequalquerprodutointerativoéquetodaaçãotemque
terumareação.Eumainterfacequerespondeimediatamenteaoscomandos
dousuáriocontribuibastanteparaumaboaexperiência.

---

Figura 4.5: Um outro usuário com o mesmo nirmão gêmeo do mal. Assustador.

me já existe. Talvez seja seu

Você já deve ter passado por essa experiência em algum site: termina de preencher um formulário enorme, aperta o botão Enviar e nada. Nenhuma resposta. Você não sabe ao certo se a sua compra está sendo processada, se você precisa aguardar ou se precisa clicar novamente. Em muitos casos, a falta de clareza sobre o status do sistema faz com que os usuários cliquem várias vezes no mesmo botão – podendo acarretar duplicidades de cadastros e compras, gerando mais trabalho e custos para a empresa.

## 4.6 EVITE ERROS ANTES QUE ACONTEÇAM

Mais interessante ainda do que comunicar erros com clareza quando eles acontecem é evitar que eles aconteçam em primeiro lugar. Erros normalmente são causados por erros dos usuários ao interagirem com o sistema. Mas se você parar pra pensar, o erro do usuário é culpa da interface que não o guiou corretamente na hora de realizar a tarefa.

Repare no exemplo abaixo do iOS. Quando você seleciona uma imagem no seu aplicativo de fotos e decide compartilhar, o sistema oferece algumas opções (mensagem, e-mail, Facebook etc.). Mas repare que, quando você seleciona mais do que 5 imagens (exemplo da direita), o iOS automaticamente oculta a opção de compartilhar por e-mail. Isso porque ele sabe que, no geral, 6 imagens anexadas a um e-mail o tornarão pesado demais para ser enviado, podendo ser recusado por alguns provedores.

---

AT&T 9:42 PM 45%
3 Photos Selected Cancel

AirDrop
Share instantly with people nearby. If they do not appear automatically, ask them to open Control Center and turn on AirDrop.

Message Mail iCloud Facebook

Copy Print

Cancel

AT&T 9:42 PM 45%
8 Photos Selected Cancel

AirDrop
Share instantly with people nearby. If they do not appear automatically, ask them to open Control Center and turn on AirDrop.

Message iCloud Facebook Flickr

Copy Print

Cancel

Figura4.6:Quandomaisde5fotossãoselecionadas,oiOSocultaaopçãode
compartilharpore-mail,paraqueelenãofiquemuitopesado.

O Twitter é outro exemplo de produto que prefere evitar que os erros
aconteçam,emvezdemostrarmensagensdeerroquandojáétardedemais.
Nahoradecomporumtweet,ainterfacedestacaemvermelhooscaracteres
excedentes(acimade140)edesabilitaobotãoparaevitarqueousuárioerre.

---

Compose new Tweet

Estou escrevendo um novo tweet, mas ele pode acabar ultrapassando o limite de 140 caracteres. O Twitter antecipa meu erro e marca de vermelho o trecho do tweet que está em excesso...

Add photo Location disabled -42 Buffer Tweet

Figura4.7: Oerroécomunicadocomclarezaeobotãoédesabilitadopara
queelesequeraconteça.

A Siri (a assistente de voz do iPhone) também conhece bem os erros
comunsdossereshumanos. Quandojápassoudameia-noiteevocêpede
paraelaregistrarumlembreteparavocêfazer“amanhã”,elaconfirmasepor
“amanhã”vocêquisdizeraquelemesmodiaouodiaseguinte.

---

Verizon 12:27 AM 83%
“Remind me to inflate my tires tomorrow at 9 AM”
Just to be clear... did you mean October 21st, or October 22nd?
October 21st
October 22nd

OGmailvaimaislongenahoradeprevenirerros. Quandovocêclica
em Enviar,eleescaneiaotextodoseue-mail. Sevocêescreveupalavras
como“anexado”ou“anexo”enãoadicionounenhumarquivoanexadoàsua
mensagem, elemostraumalertaconfirmandosevocêrealmentenãoquer
enviarumarquivoousefoisomenteumadistraçãosua.

---

The page at https://mail.google.com says:
Did you mean to attach files?
You wrote "I've attached" in your message, but there are no files attached. Send anyway?
Cancel OK

Ive attached a file blah blah....

G

Figura4.8: Vocêescreveu‘anexei’namensagemmasnãotemnenhumarquivoanexado.Mandarmesmoassim?

Existem vários métodos para prevenir erros antes que eles aconteçam.
Umaformainteressantededescobriroserrosmaiscomunsdosseususuários
aointeragiremcomseuprodutoéolharparaasmétricasdosite. Quaiserroselesestãocometendocommaisfrequência? Qualainformaçãoqueeles
inseriramerradoparaqueoerroacontecesse? Porqueelespensaramque
deveriamfazerumaaçãodiferentedaqueestavasendopedida? Comovocê
podeevitarqueesseerroaconteçacomnovosusuários?

Astaxasdeconversão(eoseucliente)agradecem.

## 4.7 Simplifique formulários

Qualomínimodeinformaçãoquevocêprecisacoletardousuárioparaque
elepossaseguiradiantenofluxo?

Pareceumaperguntasimples,masmuitagentedeixaessadiscussãopassarbatidanahoradeelaborarumformuláriodecadastrooudecompra.Uma
práticacomum(masnemsempreideal)éreuniremumúnicoformuláriotodososcamposquevocê,comoempresa,desejasabersobreoconsumidor.

Masseráquetodasasinformaçõesqueestãosendopedidassãoextremamentenecessárias?Algumadessasinformaçõespodesercoletadaemummo- mentofuturo?Estáclaroparaoconsumidorporqueaquelainformaçãoestá
sendosolicitada?

Umótimoexemplodesimplificaçãodeformulárioéodecadastrono
AirBNB,umsitedealugueldeimóveisquetemversõesemváriospaíses.

Oformulárioparaconsultarseumimóvelestádisponívelparaaluguel
pede **apenasasinformaçõesextremamenterelevantesparaaquelaação.**
Reparequeelesnãopedemparaousuáriosecadastrar, nempedemoendereçodee-mail,nemnenhumaoutrainformaçãoquenãotenharelaçãodiretacomaquelatarefaqueousuáriopretenderealizar(consultardisponibilidadedeumimóvel).

airbnb
Beautiful Nice Studio front beach**
Nice, Provence-Alpes-Côte d'Azur , France
Hosted by: Josy
Check In Tap to Select
Check Out Tap to Select
Guests
Total
Review Details

UmoutroexemplointeressanteéodositeNike.com. Nahoradefechar
umacompra, elesdãoaousuárioaopçãode“GuestCheckout”(Comprar
comoconvidado),permitindoqueelesfechemacomprasemanecessidade
decriarumperfildentrodosite.

---

HOW WOULD YOU LIKE TO CHECK OUT TODAY?

SIGN IN

Email Address

Password

Password help

Why can't I log in from Facebook or Twitter?

MEMBER CHECKOUT

GUESTS

Check out without logging in.

Optional: Register with Nike to receive:
Free and easy returns on all ordersExpress
checkout and order trackingTracking and
sharing your Nike+ activity
Become a Nike member during checkout.

GUEST CHECKOUT

PAYPAL MEMBERS

Make your payment with PayPal's secure services.
You'll have a chance to apply promotion codes and/or
gift cards before you complete your order.

Check Out
with
PayPal

“Comoassim,voudeixarapessoafazerumacomprasemsequerpedir
paraelacriarumloginesenha?”

Pareceassustadordopontodevistadaempresa.Maspareummomento
parapensarnoobjetivodousuárionaquelemomento:eleestásuperempolgadocomaideiadecomprarumtênisnovo.Pedirparaelecriarumcadastro
Nikenessemomentoseriaumdesvioderotaabsurdamentegrandenaexperiênciadousuário.

“Mas assim eu estou perdendo a oportunidade de ganhar um usuário
cadastrado!”

Seousuárioquercomprarotênis,omelhorasefazerégarantirqueele
consigarealizaressatarefadaformamaissimplespossível.Issovaiassegurar
umavendaamaisnoseue-commerce,quetemimpactodiretonalucratividadedaempresa.

“Edepoiseupercoesseusuárioparasempre?”

Não. OqueaNikefazéapenaspediroendereçodee-maildousuário,
comopartenaturaldoprocessodecompra. Depoisdealgunsdias,depois
queotênisfoientregueeousuárioestáfelizdavidacomonovoproduto,
elesmandamume-maildefollow-upconvidando-oaterminarocadastro,
criarumasenhaeusufruirdosinúmerosbenefíciosdeterumperfildentrodo
site.Aliás,quandoelesenviamessee-mailpós-compraelesoferecemalgum tipoderecompensaparaousuário(“termineseucadastroenãopaguefrete
emsuapróximacompra”).Maisumexemplodacombinaçãode **usabilidade**
com **psicologia** mencionadanoiníciodolivro:eliminarbarreirasdofluxodo
usuárionahoradacompraedaraeleummotivoparavoltaraositeeterminar
ocadastromaistarde.

Ainda no assunto “formulários”, uma boa prática de usabilidade é ter
certezadequevocêestáapresentandoomelhortipodecampoparaousuário.
Quandoousuárioprecisaselecionarumadata,porexemplo,émuitomais
fácilemuitomaisfamiliarparaeleapresentarasopçõesemformatodecalendário–emvezdemostrarsomenteumcampotextoetorcerparaqueele
digiteadatanoformatoDD/MM/AAAAquevocêprecisa.

Vejaoexemplodositefourseasons.com. Nahoradesolicitaradataem
quepretendesehospedaremumdoshotéis, ositeapresentaaosusuários
umcalendárioondeelepodeselecionaradatadecheck-inedecheck-outde
formamuitomaisvisualdoquesimplesmenteumcampodetexto.

ACCOMMODATIONS PHOTOS & VIDEOS SERVICES & AMENITIES DINING SPA DESTINATION OFFERS MAKE A RESERVATION

When will you be staying with us?
CHECK IN: 06/12/2012
CHECK OUT: 06/14/2012
Numbers of Nights: 1

How many guests?
2 ADULTS 0 CHILDREN (0-18 yrs)
MULTIPLE ROOMS | CORPORATE/PROMO CODE
FIND ROOMS

JUNE 2012
Su Mo Tu We Th Fr Sa
1 2
3 4 5 6 7 8 9
10 11 12 13 14 15 16
17 18 19 20 21 22 23
24 25 26 27 28 29 30

JULY 2012
Su Mo Tu We Th Fr Sa
1 2 3 4 5 6 7
8 9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30 31

Nosúltimosanos, várioswebsitesdecompanhiasaéreascomeçarama
adotar o mesmo padrão de interação para permitir que os usuários selecionemasdatasdosvooscommaiscomodidadeecommenoschancesde
erro.

Otópico“usabilidade”ébastanteextensoeháváriosanosmuitoconteúdosobreoassuntoépublicado,tantoonlinequantoemlivros. Existem diversosprincípiosdeusabilidadelistadosporautoresdiferentesetambém
muitospontosdediscórdiaentreeles.

Maisimportantedoquedecorarumalistaprontaécomeçaraprestarmais
atençãoenquantoestiverutilizandoprodutosdigitaisecomeçarajulgar,por
contaprópria,oquefuncionaeoquenãofuncionaemmatériadeusabilidade.

## Gosta desse assunto?

Sevocêteminteresseemconhecermaissobreusabilidade,acesse http:
//fabricio.nu/usabilidade paraversugestõesdelivrosmaisavançados.

---

Capítulo 5

# Abelezadospequenosdetalhes

Aspessoasnãoexperienciamprodutoseserviçosdeumaúnicavez. Apesar
deoFacebookserumprodutogigante,comumasériedefuncionalidades,
aplicativos,páginaserecursos,nãoédessaformaqueousuáriocomumtem
contatocomaplataforma. OFacebookéaquelamensagemqueumamigo
mandou e você respondeu em poucos segundos. É aquele passatempo de
passearpeloseufeeddenotíciasnoseucelularecurtirumououtropostde
seusamigosenquantoesperaoelevadorchegar.Éumanotificaçãoquevocê
recebenomeiododia,éumafotoquedecidecompartilharcomsuafamília.

Aocontráriodaspessoasquetrabalhamcomodesenvolvimentoedesign
deprodutosdigitais,osusuáriosfinaiscostumamterumavisãofragmentada
sobreoqueoprodutorealmenteé. Oproduto,paraeles,éumasériedepequenasinteraçõesqueformamumaimpressão(positivaounegativa)como
passardotempo.

Eparaconstruirexperiênciasquesejammemoráveiserelevantesparaas pessoas, muitas vezes é preciso estar a talhes.

ento a essas pequenas interações e de-

Os pequenos pontos de contato entre consumidor e marca são tão importantes para UX que em 2012 Dan Saffer publicou um livro (http:// microinteractions.com) onde dava um nome para esses momentos: Microinterações.

## MICROINTERAÇOES

“Microinterações são momentos contidos de um produto que giram em torno de um único caso de uso – eles têm apenas uma função principal. Cada vez que você muda uma configuração, sincroniza seu dispositivo, configura um alarme, cria um password, faz login em um site, define uma mensagem de status, favorita ou 'curte' algo, você está engajando com uma microinteração. Elas estão em todo lugar: nos dispositivos que carregamos, nos eletrodomésticos da nossa casa, nos aplicativos no nosso celular e computador, e até embutidos nos ambientes em que vivemos e trabalhamos. Muitos produtos e aplicações são construídos inteiramente em torno de uma única microinteração.”

É o tal "slide to unlock" do seu iPhone. Ou o padrão de desenhar a senha para desbloquear seu smartphone Android. O bonequinho que você arrasta para o Google Maps para ativar o modo StreetView. O clássico botão "iniciar" do Windows.

Todos esses são exemplos de microinterações que foram polidas ao extremo. O cuidado com os detalhes contribui para que aquele pequeno ponto de contato entre consumidor e marca seja único, icônico, prazeroso e fácil de usar.

---

slide to

Pull down to refresh...

Favorites
Documents
Settings
Find
Help
Bun...
Log Off
Shut Down...

Buy now with 1-Click®
Deliver to:
Fabricio's Kindle

Chocolate
Pinch Apart to Create Item

Figura5.1: 1. SlidetounlockdoiPhone,2. PulltorefreshdoTwitter,3. ArrastaropegmannoGoogleMaps,4.BuywithoneclickdaAmazon,5.Botão
iniciardoWindows,6.PinchaparttoaplicativoClear.

Reparequecadaumdessesmomentoséapenasumpequenorecortede
umafuncionalidademaior. Emvezdeolharparaonúmerodefuncionalidadesqueoseuprodutopossui,aregraaquiéolharparaaspequenasinteraçõesquecompõemtalfunção.

DanSafferdefineasmicrointeraçõescomo“asmenoresunidadespossíveisdaexperiênciadousuário”.Masmenornãoquerdizer“insignificante”.
Naverdade,algumasinteraçõespodemterimpactograndiosoemcomoas
pessoasexperienciamoseuprodutoepercebemsuamarca.

Ofatoéquepoucosdesignersedesenvolvedoresdedicamtemposuficienteparapensarnosdetalhesquefazemumprodutoserúnico–edeixam
passaroportunidadesexcelentesparamelhoraraexperiênciadosusuáriosem
suamanifestaçãomaisgranularecorriqueira.

---

## Bom para os usuários, bom para a empresa

Há quem diga que esse tipo de detalhe é superfluo: "o mais importante é fazer o produto funcionar, colocar o produto na rua", dizem os mais céticos. Mas se você pretende colocar um novo produto no mercado, as pequenas nuances de interação podem ser uma oportunidade e tanto para criar diferenciação em relação aos competidores.

Hoje em dia, é comum que novos produtos surjam, diariamente, em mercados que já são extremamente competitivos. E grande parte desses produtos que estão competindo pela atenção dos consumidores possuem funcionalidades muito parecidas entre si.

São tantos os produtos disponíveis por aí que cumprem a mesma função, que os consumidores já estão começando a optar por aqueles que são mais agradáveis de usar. Não é mais sobre "encontrar um aplicativo que me permita anotar minha to-do list", mas sim "encontrar o aplicativo que faz com que essa tarefa seja agradável e fácil de fazer".

Mas, além de criar diferenciação em menitos, esses pequenos detalhes – quando bem pr benefícios para os usuários e para as empresa

rados com paridade de produpjetados – podem trazer outros :

Para os usuários, interações bem desenhadas são faceis de usar e dão a sensação de que o produto é mais eficiente. Elas também tornam o processo mais agradável, ajudando a aumentar o nível de engajamento dos usuários com a aplicação.

Para as empresas, interações bem desenhadas criam fidelidade entre os usuários e o produto. Também aumentam as taxas de conversão ao reduzirem a fricção no fluxo do usuário, permitindo que eles completem a tarefa com mais facilidade. Além disso, é claro, proporcionam experiências memoráveis e melhoram a percepção que os usuários têm das marcas. Não é à toa que designers costumam preferir produtos da Apple, uma empresa que ganhou popularidade nos últimos anos pelo nível de cuidado que tem com os pequenos detalhes das experiências que oferecem.

Um estudo realizado por Des Taynor (http://brucejacob.tumblr.com/post/372896867/the-thickness-of-napkins) mostrou o quanto os pequenos detalhes podem afetar a percepção que as pessoas têm das experiências pelas quais elas passam, não apenas no mundo digital. Nos restaurantes, por ex- emplo, **aespessuradosguardanapos** temimpactodiretonopreçoqueos
usuáriosestãodispostosapagarpelarefeição. Umdetalhequemuitasvezes
passadespercebidoparaaquelesquesãoresponsáveispor“desenharaexperiênciadecomeremumrestaurante”,masqueafetaosubconscientedosconsumidoreseimpactadiretamentenapercepçãoqueelestêmsobreoestabelecimento.

Naspróximasseções,vocêveráalgumasboaspráticaseminterfacesdigitaisemqueaatençãoaospequenosdetalhesfazumagrandediferençana
experiênciadousuário.

## 5.1 Evite elementos em excesso

Umatentaçãocomumnahoradedesenharinterfaceséadicionarumnovo
elementonatelaquandovocêprecisaapresentarumanovainformaçãopara
ousuário.Masseráquenãoépossívelreutilizarumelementoquejáestejalá?

AinterfacedepagamentodoGumroadutilizaummesmoelementopara
passarduasmensagensdiferentes:aminiaturadocartãodecréditonocanto
superiordireitoindicaabandeiradocartão(Visa)quandoousuáriodigitaos
números,mastambémservecomoumindicativodeondeelepodeencontrar
ocódigoverificador(CVC)quandoelepuladeumcampoparaooutrodo
formulário.

Payment details VISA
4242 4242 4242 4242
EXPIRY DATE DUE DATE
10 / 12 123
Pay
Payment details
4242 4242 4242 4242
EXPIRY DATE DUE DATE
10 / 12 536
Pay

---

## 5.2 Revele informações progressivamente

ONewYorkTimestrazumasoluçãointeligenteparasimplificarainterface
nocampodecomentáriosdeseusite.Emvezdeexibirlogodecaraoscampos
decadastronecessáriosparadeixarumcomentárioemumartigo,elepreferiu
simplificar.

Primeiro, o usuário vê apenas um campo convidando-o a comentar a
notícia.

217 COMMENTS

Leave a Comment

ALL READER PICKS NYT PICKS Newest

amydm3 San Francisco, CA FLAG
Why can't the Republican Party refuse to fund recalcitrant tea party members if they refuse to behave like grown ups?
Oct. 2, 2013 at 6:30 p.m. REPLY RECOMMEND

R. Law Texas
Mo, you say " Cruz's sock puppet ", but is Cruz really just doing the bidding of Club for Growth, the Grover Norquist pledge, Heritage, FreedomWorks, etc., and aren't they the real agents manipulating Boehner ?

Sódepoisdeclicaréqueoscamposdecadastrosãoexpostos.

---

ALL READER PICKS NYT PICKS Newest

Write a Comment Suggest a Correction?

Display Name Location Not You?

Type your comment here.

1500

E-mail me at az@la.net (change?) when my comment is published.

Submit

Comments are moderated and generally will be posted if they are on-topic and not abusive.

Comments FAQ »

amydm3 San Francisco, CA

Why can't the Republican Party refuse to fund recalcitrant tea party members if they refuse to behave like grown ups?

Umamedidasimples,masqueevitaqueatelafiquemuitopoluídacom
elementosquenãosãoestritamentenecessáriosemumprimeiromomento.

## 5.3 Seja cuidadoso com o tempo do usuário

VejaoexemplodoFlickrnahoraemqueosusuáriosestãosubindoumasérie
defotosparapublicarnosite.

Comooprocessodeuploaddefotospodeserdemorado(dependendodo
númerodeimagensqueousuárioquerenviaredependendodaqualidadede
suaconexão),oFlickrresolveuevitarqueousuáriofiqueparadoesperando
ouploadserconcluído.

---

(84% complete) Flickr: Upload...

Figura5.2:Flickrsinalizanaprópriaabadonavegadoraporcentagemdeuploaddasphotosdousuário.

Emvezdisso,eleutilizaoprópriotítulodaabacomoumindicadorde
progresso.Assim,ousuárioficalivreparapassearporoutrasabasdonavegadorenquantooFlickrfazotrabalhopesadodesubirasfotosparaosite.

UmoutroexemploéodaBlizzard,duranteoprocessodeinstalaçãode
jogospesadoscomoWorldofWarcraftouDiablo.Comootamanhodosarquivospodetotalizar5GBoumais,oprocessocompletodeinstalaçãopode
levarlongosminutos.MasparecequeaBlizzardconhecebemoseupúblicoalvoeocontextodeuso:gamersavançadosqueacabaramdecomprarojogo
eestãoquasetendouminfarto,tamanhaaansiedadeparacomeçarajogar.

1 SETUP 2 PLAYABLE 3 OPTIMAL 77% PLAY
UPDATING FILES [ 14270 / 14474 ]

2 PLAYABLE 93% PLAY
TOTAL DOWNLOAD REMAINING: 10.5MB [317KB/S]

3 OPTIMAL 99% PLAY
TOTAL DOWNLOAD REMAINING: 3.94MB [316KB/S]

Asoluçãoétrabalhosa.Primeiro,umasoluçãotécnica:garantirqueosis- temacomeceainstalaçãopelosarquivosquesãoindispensáveisparaojogo
funcionar,edeixarosarquivos“supérfluos”(comoanimaçõeseminifilmes)
paraofinal. Depois, umasoluçãodeUX:sinalizarcomcoresdiferentesa
evoluçãodabarradeprogresso. Apartirdomomentoemqueabarrade
instalaçãoficaamarela(segundaimagem), issosignificaqueojogojáestá
disponívelparaseriniciado, mesmoqueaindanãocontenhatodasasanimaçõesefilmesdentrodele. Reparetambémque,nessemomento,obotão
de“Play”nocantodireitopassaaficarhabilitado,permitindoqueousuário
comeceajogarotãodesejadojogo.

Otempodousuárioéalgopreciosoparaele.Produtosqueentendemessa
importânciaconseguemutilizarissoafavordaexperiênciadousuário.

## 5.4 Crie experiências personalizadas

Àmedidaqueosusuárioscomeçamainteragircomoproduto,umasériede
informaçõespodesercoletadasobreele,mesmoqueinvisivelmente.Ealgumasempresasjáperceberamquepodemusaressasinformaçõesparafazer
comqueaexperiênciadousuáriosejapercebidacomomaispersonalizada.
Vejaalgunsexemplossimples:

Welcome to Wells Fargo
Enter your PIN
WELLS
FARGO

PIN
Cover the keypad while you enter your PIN

Get $80
Checking x-1234

All Other
Transactions

AinterfacedocaixaeletrônicodobancoWellsFargo“aprende”comopassardotempoqualatransaçãofinanceiraqueousuáriorealizacommaisfrequência.Napróximavezqueeleforatéumcaixaeletrônico,aquelatransação comum(sacar80dólares,nomeucaso)édestacadaemsuatelainicial.Uma
espéciede“atalho”paraatransaçãomaisfrequente. Seeufosseanotarna
pontadolápisquantotempoequantos“cliques”eujáeconomizeicomisso,
dariaparaescreverumlivro.

JáoEbay,comoédeseesperar,controlatodasascomprasquevocêjáfez
nosite. Quandovocêestávendoapáginadeumprodutoquevocêjátenha
compradoanteriormente,onomedobotãocomprarmudade“ Buy”para“
Buy Another”.

Item condition:
New other (see details)
Quantity:
1 5 available / 60 sold

US $12.95 Buy another
Add to cart
Add to Watch list

Éumdetalhesimples,masqueevitaqueusuáriosmaisdistraídoscompremduasvezesomesmoprodutosemquerer. Eparausuáriosquenãoestavamdistraídosequerealmentequeremcompraromesmoprodutopela
segundavez,essapequenamudançanonomedobotãooajudaatercerteza
dequeeleestárealmentecomprandooprodutoquejáutilizou.

## 5.5 Adivinhe a intenção do usuário

Asaçõesdousuáriogeralmentetêmumaintençãoportrás.Talvezaintenção
nãosejaexplícita, ouconsciente, mas, apartirdomomentoemqueoUX
designercomeçaapesquisareentenderosmotivosportrásdaquelaação,é
possívelbolarsoluçõescriativasparafacilitaravidadousuário.

VejaoexemplodoaplicativodebookmarksPocket. Aprincipalfunção doaplicativoésalvarlinksparaseremlidosmaistarde. Oqueelesfazemé
anteciparqualaintençãodousuário: quandoeleabreoaplicativoeexiste
umlinkcopiadoemsuaáreadetransferência,oaplicativoexibeumabarra
oferecendoparasalvarolink. Maisumavez: umatalho,paraevitarcliques
desnecessáriosdousuário.Seesseatalhonãoestivesseali,ousuárioteriaque
clicarem“SalvarNovoLink”,depoiscolarolinkqueestavacopiado,edepois
confirmar.Comesseatalho,ousuáriorealizaamesmatarefacomumúnico
clique.

L AT&T 4G 10:15 AM 53%
pocket
Topol's Top Ten Targets for Wireless Medicine
mobihealthnews.com
So What If You Have Big Data? Without Data-Driven Processes And Products, It's Useless
techcrunch.com
First Round Debuts A 'Common Application' For Student Engineers To Apply For And Find Jobs At Portfolio Companies
techcrunch.com
Dave Chappelle: In His Own Words (2012 Tribute)
Add copied URL to your list?
venturebeat.com/2012/12/15/3-
Add

Figura5.3:OaplicativoPocketexibeumatalhonaparteinferiordatelacaso
ousuáriotenhaumlinkcopiadoemsuaáreadetransferência.

OGoogleChromefazalgoparecido. Quandoelepercebequeousuário
vaiatéasconfiguraçõesdonavegadoreescolhedeletarohistóricodenavegacãoduasvezesoumaisemumcurtointervalodetempo,elepassaaexibir umapequenamensagemnapartedecimadainterface.

Clear browsing data

Psst! Incognito mode (Ctrl+Shift+N) may come in handy next time.

Obliterate the following items from: the past week

- Clear browsing history
- Clear download history
- Delete cookies and other site and plug-in data
- Empty the cache
- Clear saved passwords
- Clear saved Autofill form data
- Clear data from hosted apps
- Deauthorize content licenses

Learn more Cancel Clear browsing data

Figura5.4:“Psiu.Omodoincógnito(Ctrl+Shift+N)podeserútilnapróxima
vez.

Alémdepouparousuáriodotrabalhodeficardeletandoohistóricode
navegaçãotodavezqueelequerevitardeixarrastros,oChromeaproveitapara
ensinarousuáriosobreumadasfunçõesdonavegador.Équasecomoseele
tentassepreverqualaintençãodousuárionomomentoemqueeleinterage
comoproduto.

Umoutroexemplodessemesmoprincípiodeusabilidadeéodevários
playersdemúsicadisponíveisnomercado(iTunes,Spotify,entreoutros).

---

Fertile Field
Bobby McFerrin
0 05

Quandovocêclicanobotão“ Voltar”ou“ Rewind”,existemduasalternativasquepodemacontecer,semquevocêsequerperceba:

• Seamúsicaacaboudecomeçar,obotãoRewindvoltaparaamúsica
queestavatocandoantesdessa.

• Sejásepassaramalgunssegundos,omesmobotãoRewindvoltapara
osegundo0:00damúsicaqueestátocandoatualmente.

Porqueelesfazemisso?Porquequandovocêestáouvindoumamúsica,
gostamuitodelaequerouvi-lanovamente,nemsemprevocêconsegueapertarobotãoRewindrápidoosuficiente,antesdeamúsicaterminar. Entãoo
aplicativolhedáalgunssegundos“defolga”.Mesmoqueapróximamúsicajá
tenhacomeçado,vocêaindatemquatrooucincosegundosdedescontopara
apertarRewindevoltarparasuamúsicafavorita.

Ah,abelezadospequenosdetalhes.

## 5.6 Faça o trabalho pesado

ReparenoexemploaseguirdoGooglePlus.Comotodaredesocial,éobviamenteimportanteparaelesquevocêmantenhaoseuperfilomaiscompleto
possível.

Mas,emvezdeperguntarondevocêtrabalhacomumcampodetexto
aberto,fazendocomquevocêtenhaquedigitaronomedaempresa,elesbolaramumasoluçãomaissimples. Elesvarremosperfisdosseusamigosna
redesocialeprocuramolocaldetrabalhodetodoseles.Aoobservaremque
umagrandeparceladosseusamigostrabalhanaempresaX,elesjálheoferecemessaopçãodeempresaprontamentenahoraemquevocêfazloginno site.Tudooquevocêprecisafazeréclicarem“Sim”–eentãoelesatualizam
aquelainformaçãonoseuperfil.

COMPLETE YOUR PROFILE
80% complete
14 of your friends work at Google.
Do you work here, too?
Yes No
Visible to everyone

Figura5.5:OGooglePlusfazotrabalhopesadoparaqueousuáriosóprecise
clicarumavezparaconfirmar.(viaLittleBigDetails)

## 5.7 Seja honesto com seus pedidos

Pedirparaousuáriofornecerinformaçõespessoaiséummomentodelicado
daexperiênciadousuário. Muitasvezeselenãovêobenefícioexplícitoem
forneceraquelainformação–eacabaachandooformuláriotrabalhosodemaisparaserpreenchido.

Masvejaoexemplodosserviçosdee-mailMailchimpnahoradepedir
paraousuáriocadastrarasinformaçõessobreoseusite.

---

| Website URL |
| --- |
| So we can automatically grab your logo and color palette from your website. No website? |
| Your Industry |
| Please Specify... |
| So we can show you how your campaign performance compares to similar companies/organizations. |
| Timezone |
| (GMT -4:00) Eastern Time |
| When you schedule campaigns, we'll use this timezone as a reference. |

Paracadainformaçãoqueelespedemaousuário,existeumabreveexplicaçãosobrecomoaqueledadoseráusado. Éumaformadiretaerápidade
fazercomqueatrocafiquemaisjusta:ousuárioficasabendonahoracomoé
queaquelainformaçãoseráusadapelaempresa,evêqualobenefícioqueele
recebeemtroca.

## 5.8 Expresse a personalidade da sua marca

Nosdiasdehoje,consumidoressãoexpostoscommuitomaisfrequênciaàs
interfacescriadasporumamarcadoquepelosesforçosdecomunicaçãoquea
marcafazatravésdepropaganda,relaçõespúblicasoueventos,porexemplo.

PenseemquantasvezesvocêtiraoseuiPhoneouAndroiddobolsoe
utilizasuainterface;provavelmenteumnúmeroinfinitamentemaiordoque
onúmerodevezesquevocêviuumcomercialdealgumadasmarcasque
criaramessessistemasoperacionais.

---

Google play unicorns

Figura5.6:CasovocêbusquealgonaGooglePlayStoresemdigitarnadano
campo,osistemabuscaautomaticamentepelotermo‘Unicórnio’.

Ospequenosdetalhesdasinterfacespodemdizermuitosobreapersonalidadedeumamarca. Quandovocêdigitaumpasswordincorretonoseu
MacOSounoseuiOS,ajanelasacodedeumladoparaoutro,comosefosse
umapessoabalançandoacabeçanegativamente. Nãoháanecessidadede
umamensagemdeerroformaldizendoque“vocêdigitouoseupasswordincorretamente”.Afinal,issosoariamuitomaisfriodoqueadivertidaanimação
criadapelosdesignersdaApple.

Fabricio Teixeira
Password

Algumasmarcaspreferemsermaisexplícitasnahoradeexpressarsua
personalidade,usandooprópriotextodainterfaceparaintroduzirmomentos
dedescontraçãonaexperiência.

---

paigns Lists Reports Autoresponders Account Search Help You know where you ARE? You're in the jungle, Ben!

Figura5.7:Vocêsabeondevocêestá?VocêestánaSELVA,Ben.

UmdospapéisdoUXdesignerquandoestádesenhandointeraçõeséo
deidentificaroportunidadesdeprestaratençãoaosdetalhes.Quemtrabalha
diretamentecomtestesdeusabilidadesabeoquãogratificanteéverareação
dosusuáriosaumdetalhequevocêpensoucomcuidadonahoradecolocar
nainterface.

Nofimdascontas,éasomadessespequenosmomentosdesurpresae
deboausabilidadequefazcomqueaspessoasseapaixonempelosprodutos
queusamesetornemfiéisaumamarca. Evocê,comoUXdesigner,tema
possibilidadedemelhoraravidadaspessoas,umainteraçãodecadavez.

## Gosta desse assunto?

Sevocêteminteresseemaprendermaissobreostemasdestecapítulo,
acesse http://fabricio.nu/detalhes paravermaisreferências.

---



---

Capítulo 6

# Aimportânciadosmicrotextos

Háalgunsanos, falava-semuitosobreofatodequeusuáriosnãoleemna
web.Masconvenhamos,issoeraemumaépocaemquegrandepartedasinterfacesdigitais(majoritariamente“sites”)utilizavamgrandesblocosdetexto
paracomunicarmensagensaosusuários.Talvezumaherançadasrevistasimpressas,cartilhasoumanuaisdeinstrução,ondesepartedopressupostode
queousuárioestádispostoalertextosemprofundidade.

Anosdepois:mobile.Umamudançadeparadigmaqueafetounãoapenas
aformacomoossistemassãodesenhados,mastambémamaneiracomoos
usuáriossecomportamaointeragiremcomeles.

Dopontodevistadosistema:interfacesextremamentepequenas,com
espaçolimitadoparatextoeumtipodeinteraçãomuitomaiscurta,breve,
empequenasdoses.

**Do ponto de vista do usuário:** uso muito mais fragmentado de tecnologia no decorrer do dia (150 vezes, em média, de acordo com o site http://tech.firstpost.com/news-analysis/smartphone-users-check-their-phones-an-average-of-150-times-a-day-86984. html) , o hábito do multitasking e um nível de concentração muito diminuído sobre o que está sendo feito.

Tendo isso em vista, é natural que as postas a "ler" interfaces.

essoas estejam muito menos dis-

Daí surge o termo "microtexto" ("microcopy" em inglês). Na prática: a arte de conseguir transmitir uma mensagem em pequenos fragmentos, num espaço limitado de texto, com concisão, clareza e personalidade. Pode ser o nome de um botão, uma mensagem de erro ou sucesso, uma linha de instrução exibida acima de um formulário, um tooltip de ajuda - qualquer texto de interface.

Figura 6.1: O link de 'Like' do Facebook: microtexto do começo ao fim.

O "Curtir" do Facebook. Repare como a em texto. Quando o usuário clica, o feedback em texto ("Like" vira "Unlike").

cao inicial é descrita somente transmitido também somente

E para desfazer a ação? Somente texto, de novo.

É interessante observar o uso de microtexto sob dois aspectos: um mais funcional e outro mais emocional.

O aspecto funcional é o fato de os estados são transmitidos com clare ambiguidade.

tistir uma ação simples na qual todos a ao usuário. Sem erro. Sem ruído ou

---

Já o aspecto emocional é um pouco mais abstrato, naturalmente. A ação escolhida pelo Facebook foi "Curtir", por algum motivo. É o verbo que mais combina com a personalidade leviana da rede social. Imagine se fosse "Legal". Imagine se fosse "LOL" ou "Adorar". Talvez você achasse o Facebook muito mais pegajoso do que já acha. Para cada país em que o produto é traduzido, o Facebook escolhe o verbo que funciona melhor culturalmente dentro o seu público-alvo.

Figura 6.2: Já o serviço de blogging Svbtle preferiu chamar o seu botão de 'Kudos'; mais alinhado com sua personalidade.

O microtexto ajuda não apenas o usuário cendo no sistema, mas também a formar em tem daquele produto/marca.

o entender o que está aconte-sua cabeça a percepção que ele

## 6.1 O VALOR FUNCIONAL DOS MICROTEXTOS

Além de explicar uma ação ("cadastrar"), um microtexto pode ser usado para orientar o usuário na realização de uma tarefa ("sua senha deve conter no mínimo 6 caracteres") ou dar feedback sobre uma ação que ele realizou ("sua conta foi criada com sucesso").

Também é possível usar microtextos para antecipar necessidades, anseios ou preocupações que o usuário terá ao realizar determinada tarefa. Veja o exemplo a seguir, citado no artigo de Joshua Porter (http://bokardo.com/ archives/writing-microcopy) .

---

Transactions are handled through paypal but you don't need a paypal account to buy this book. Any credit or debit card will do! (If at any stage in the ordering process you encounter a problem please contact us)

A Technical Guide to
Designing
for the Web

Napáginadecompradolivro,oautoradicionouumalinhadetextoque
écrucialparaquemestáconsiderandoefetuaracompra:“astransaçõesutilizamPayPal,masvocênãoprecisaterumacontaparacompraresselivro”.

Issoantecipaumadasprincipaispreocupaçõesquepassampelacabeça
daspessoasquandoelasveemologotipodoPayPal(“ih,eunãotenhouma
contalá”)eevitaqueelasabandonemofluxoporcausadisso.

---

Email address

Password

URL (you can change this at any time)

.tumblr.com

Start posting →

Figura6.3: Exemplodeantecipaçãonoformuláriodecriaçãodeumnovo
Tumblr.

Em seu livro mais recente (http://microinteractions.com) , Dan Saffer
abordaoassunto“Microcopy”edáalgumasdicasúteisnahoradeescrever
essetipodetexto:

• Evitenomesdeaçõesmuitovagos,como“Enviar”.Oqueacontecedepoisqueousuário“Envia”osdadosdoformulário? Seráqueonome
dobotãonãopodeexplicarissoparaousuário?

• Otextodeinstruçãoéabsolutamentenecessário?Vocênãoprecisaadicionarum“Porfavor,façalogin”acimadeumformuláriodelogin,por
exemplo.

• Quandootextoémuitolongoeprecisasertruncadonainterface,tenha
certezadequeousuárioconseguelerotextocompletofacilmente.

• Testeseustextoscomusuáriosreais.Mostreumainteraçãocommicrotextoparaelesepeçaparaelesdizerememvozaltaoqueachamque
aconteceráaoclicaremouinteragirem.

• Uselinguagemhumana,nãodesistema.“Postadohá3horas”émuito mais fácil de entender do que "postado em 04/03/2014 às 14h33" - um detalhe que acaba passando batido em muitos produtos por aí.

## 6.2 O VALOR EMOCIONAL DOS MICROTEXTOS

Esses dias preenchi minha declaração de imposto de renda aqui dos EUA usando a ferramenta TurboTax. Foi uma experiência tão simples e tão cuidadosamente pensada, que quando terminei eu queria sair contando para todos os meus amigos UXers como tinha sido. Eles, obviamente, já estavam acostumados com o produto.

Preencher a declaração de imposto de renda não é uma tarefa breve (são muitos e muitos passos), mas o interessante da experiência do TurboTax é como eles usam microtextos para encorajar os usuários a seguirem em frente. Eles "celebram" cada pequena conquista sua à medida que você vai percorrendo cada um dos mais de 50 passos do formulário. O resultado? Durante o processo, fiquei muito mais tranquilo do que achei que ficaria antes de começar.

Figura 6.4: Microtexto no TurboTax.com depois que você envia a declaração: imposto de renda sem complicação.

Em muitos produtos, o microtexto representa também uma ótima opor- tunidadeparaexpressarapersonalidadedamarca. Apesardalimitaçãode
pixelsecaracteresdosmicrotextos,aescolhacertadaspalavraspodeajudara
transmitiralgunsdosvaloresdamarcaparaseususuários(comooexemplo
doFacebook“Like”citadoanteriormente).

OMailchimp.com,porexemplo,usacadaoportunidadequetemparaexpressarsuapersonalidade. Elesinclusivepublicaramumguiasobretomde
voz(http://voiceandtone.com)paraquemcostumaredigire-mailmarketing.

## 6.3 Comunique benefícios, não funcionali- dades

Sevocêexplicaparaaspessoasoporquêdevocêestarpedindoparaelasfazeremalgo,émuitomaisprovávelqueelasaceitemsuasugestão.Éumpequeno
truquedetextomasquepodetergrandeimpactonosentidodeencorajaras
pessoasatomaremalgumaação.

Emredação,hásempredoiselementoscomuns:funcionalidadesebenefícios.Oprimeiroésobreoqueumprodutofaz.Osegundoésobreoqueele
permitevocêfazer.

airbnb Where are you going? BROWSE SIGN UP LOG IN

Find a place to stay.
Rent from people in over 34,000 cities and 192 countries.

Where do you want to go?
Check in
Check out
1 Guest
Search

Reparenoexemplodapáginainicialdoairbnb.com.Emvezdefalar“so- mosamaiorrededealuguéisdeimóveisdomundo”ou“alugueldeimóveis
semcomplicação”,aprimeirafrasequeousuáriovêaochegarnositeé“encontreumlugarparaficar”.

Éumadiferençasutil,masmudarofocodeoqueoprodutofazparao
queoprodutovaipermitirqueoconsumidorfaçaémaisumaformasimples
decolocaroconsumidornocentroefacilitaroentendimentodaproposição
devalordositeemquestão.

## 6.4 Fale a linguagem dos seus usuários

Aspessoasrespondembemapalavras,frasesetonsdevozdependendoda
própriapersonalidadedelas,enãoporquevocêescolheuapalavracertaou
errada.

Énessahoraquecriardocumentosdepersonaspodeserútilparaoseu
projeto.Aspersonassãoumaespéciede“retrato”dequeméopúblico-alvodo
seuproduto.Conhecerbemoperfildousuárioajudaamarcaasecomunicar
deumaformaquesoenaturalelógicaparaeles.

Vocênãodizparaumacriança“essaafirmaçãoéilógicae,portanto,inválida”.Amensagemquevocêquerpassarpodeatéseressa,masotomdevoz
usadodevesercompletamentediferenteparaqueelaentenda.Vocêdiz“não
éassimquefunciona,deixaeuteexplicar”.Umjeitomuitomaishumanode
trataracomunicaçãocomseuusuário.

Johnson's baby
JOHNSON'S® baby
HORA DO BANHO
JOHNSON'S® baby
TOQUE DE
HIDRATAÇÃO
JOHNSON'S® baby
HORA DO SONO
JOHNSON'S®
CRESCIDINHOS

VejaoexemplodositedaJohnson’sBaby. Nomenu,alinguagemescolhida(eatéascores,quetambémcontribuemparareforçaravozdamarca)
fazpartedouniversodasmãesqueestãonavegandonosite.

---

Painel Planejamento Lista de Presentes Meu Casamento Meu O Grande Dia Pais e Padrinhos Convide Amigos Convidados (RSVP) Fabricio Mariazinha 11/05/2015 São Paulo

Jáoemotion.me,siteespecializadoemajudarnoivosaplanejaremocasamento,usaexpressõescomo“OGrandeDia”nahoradeapresentaromenu
paraousuário.

Nofimdascontas,adequarsualinguagemparaouniversodoseupúblicoalvoajudaacriarumaexperiênciadousuárioquesejaaomesmotempomemorávelefácildeentender.

## 6.5 Mantenha os textos curtos

O foco aqui é o **“micro”** dos “microtextos": mantenha seus textos curtos.
Clientescostumamsemprepedirmaispalavrasemumapágina.Masotexto
semprepodesermaiscurto.Enamaioriadoscasos,textosmaiscurtosgeram
melhoresresultados.Semprequepossível,reduza.

---

EMAIL ADDRESS:

PASSWORD:
(cAsE sEnSiTiVe)

Figura6.5:Passwordé‘sEnSíVeL’amaiúsculaseminúsculas.

Textoéumapeçafundamentaldaexperiênciadousuário,àsvezesnegligenciadaporprofissionaisdeUXdepoisqueowireframefoientregue.

Acompanharodesenvolvimentodostextosqueserãoexibidosnainterfaceéimportantenãosóparagarantirboausabilidade, mastambémpara
tercertezaquetextoeimagemestãotrabalhandojuntosparatransmitiruma
mensagemalinhadacomotomdevozdamarca.

---

# Capítulo 7

# Construindoumabibliotecade padrões

Bibliotecasdepadrões,nouniversodeUserExperienceDesign,sãogalerias
quecontêmosprincipaiselementosinterativosquecompõemainterfacede
determinadoproduto–sejaeleumsite,umaplicativoouqualqueroutroprodutodigital.

---

Activity
Loading 65%
3/5 out of 2 words
1 of 2 nations

Acriaçãodebibliotecasdepadrõeséumaformadecolecionarassoluções
dedesignqueaparecemváriasvezesdentrodeummesmosite.Cadasolução
écriadapararesolverumproblemadedesign.Asgaleriasdefotos,porexemplo,sãoumasoluçãoparaexibirepermitirqueousuárionavegueporuma
sériedeimagensquefazempartedeummesmotema.

Comoosproblemasdedesigncostumamaparecermaisdeumavezdentrodomesmoproduto,fazsentidoqueodesignereodesenvolvedor **reutilizemassoluções** emvezdereinventaremarodacadavezqueoproblema
aparecernovamente.

ObomUXdesignertiraproveitodisso. Nãoéprecisodesenharnovamenteumfluxode“enviarpore-mail”oude“cadastro”acadaprojetoem cujamatrizdeescopoessesitensaparecem.Apartirdomomentoemquevocê
temumabibliotecadepadrõesàsuadisposição,passaapoderreaproveitar
esseselementosefluxoscomomínimodeajustesemoutrostrabalhos. Isso
tambémdáumagrandeagilidadenaexecuçãodoprojeto.

Elementosencontradoscomumenteembibliotecasdepadrõessão:

• Texto

• Estruturadapágina

• Tabelas

• Slideshows

• Elementosdenavegação

• Botõesderedessociais

• Ferramentadebusca

• Listagemdeartigos

• Galeriadefotos

• Módulodelinksrelacionados

• Carrosséis

• Botõesdeaçãoprimáriaesecundária

---

Featured Pattern

Carousel

Carousel item 1
Lorem ipsum dolor sit amet adipiscing elit

Carousel item 2
Lorem ipsum dolor sit amet adipiscing elit

Carousel item 3
Lorem ipsum dolor sit amet adipiscing elit

Figura7.1: Exemplodeumcarrossel,elementofrequentementeencontrado
embibliotecasdepadrões.

## 7.1 As vantagens em ter uma biblioteca

## Consistêncianaexperiênciadousuário

Projetosmuitograndescostumamserdesenhadosedesenvolvidosporuma
porção de profissionais diferentes. Algumas vezes, um time é responsável
pordesenharahomepage,enquantooutrotimeestáfocadonaferramentade
busca,porexemplo.Muitasvezes,essasdiferentesfrentesestãotrabalhando
emparalelo.Masparaousuárioéumacoisasó:eleprecisasentirquetantoa
homepagequantoaferramentadebuscafazempartedomesmoproduto.

Quandoaexperiênciaéconsistenteeoselementosinterativossecomportamdemaneirasimilar,ousuáriopassaasaberoqueesperardosistemaa
cadanovaaçãoqueeletoma.Quandonãoháconsistência,ousuárioprecisa
“reaprender”comointeragircomositeacadanovotipodeinteraçãoqueé
introduzidonaexperiência. Eisso,éclaro,contribuinegativamenteparaa
satisfaçãodousuário,paraausabilidadedosistemaeparaosresultadosde
negóciosdaempresaquecriouoproduto.

---

## Reutilização dos elementos pelo time

Cada vez que um designer cria um novo padrão de interação, isso gera um novo custo para a empresa que está desenvolvendo o produto. Afinal, o diretor de arte precisa trabalhar no layout desse novo elemento, os programadores front-end precisam fazê-lo funcionar etc. Por isso, reutilizar padrões de interação pode ser um jeito inteligente de reduzir custos no projeto, garantir uma data de entrega plausível e evitar que os times gastem horas a fio recriando soluções que já existem.

É importante, porém, que a biblioteca esteja facilmente acessível a qualquer profissional do time, que todos saibam de sua existência e que sejam encorajados a usar os elementos ali presentes sempre que possivel.

## Manutenção

Ter uma biblioteca de padrões de interação que é utilizada por todos os designers e desenvolvedores também faz com que a manutenção seja mais simples. Quando os elementos são programados da mesma forma, muitos blocos de código podem ser reutilizados, reduzindo a carga de trabalho dos programadores.

É possível também mensurar a eficácia dos elementos da biblioteca de padrões e trabalhar em cima deles para que sua performance seja otimizada. Se um determinado modelo de galeria de fotos está performando abaixo do esperado (os usuários não estão clicando nas imagens seguinte para explorar a galeria), é possivel refiná-lo e otimizar o seu funcionamento uma vez só, dentro da biblioteca de padrões. A partir do momento em que as melhorias de design e código são feitas na galeria de fotos padrão, com uma simples atualização de código todas as galerias de foto que aparecem no site todo também são atualizadas para a nova versão.

Para isso, é importante que os desenvolvedores trabalhem com o conceito de elementos globais no código do produto: em vez de inserir manualmente o código da galeria de fotos em todas as páginas em que uma delas aparece, é muito mais fácil ter um include que está sendo alimentado por um modelo global de galeria.

É lógico que as bibliotecas de padrões começam a fazer mais sentido para projetos maiores ou times em que designers e desenvolvedores estejam tra- balhando em paralelo em diferentes partes da interface. Se você está criando um site de duas ou três páginas, pode ser que não valha a pena o trabalho de criar, polir e manter uma galeria de padrões separadamente.

Outro caso comum é o de empresas que possuem diversos produtos para o consumidor final. Veja o caso do Google: muitos elementos de navegação (como paginação, botão de +1, galerias de imagens etc.) são completamente aproveitados em produtos diferentes, como o Gmail, Google Plus, Google Maps. Além de tornar a experiência do usuário mais consistente e otimizar a usabilidade dos produtos, essa padronização também permite que diversos produtos pareçam fazer parte de uma mesma família – contribuindo assim para a percepção que o usuário tem da marca.

Confira dois exemplos de bibliotecas de padrões de grandes marcas, publicados online para quem quiser consultar.

Starbucks: http://www.starbucks.com/static/reference/styleguide/

Yahoo!: https://developer.yahoo.com/ypatterns/

## 7.2 A BIBLIOTECA COMO ENTREGÁVEL FINAL DO PROJETO

Um movimento recente das empresas que trabalham com projetos de grande porte é o de considerar a biblioteca de padrões o entregável final de determinado projeto.

Pense em um site que possui mais de 50 modelos de páginas diferentes; seria insano estruturar, layoutar e desenvolver todas as páginas separadamente e tê-las como o entregável final do projeto. O que muitos UX designers fazem é desconstruir os elementos que compõem essas 50 página e categorizá-los dentro de uma biblioteca de padrões – especialmente quando as páginas possuem muitos elementos compartilhados.

Brad Frost, programador front-end que passou anos trabalhando em agências digitais nos EUA, recentemente introduziu para a comunidade de UX designers e desenvolvedores o conceito de "Design Atômico". Ele parte da mesma premissa que deu origem às bibliotecas de padrões muitos anos atrás: o fato de que, se você desconstruir as páginas de um site, é possivel chegarnasmenoresunidadesdedesignpossíveis:os“átomos”dodesignde
interação.

ATOMS MOLECULES ORGANISMS TEMPLATES PAGES

Figura7.2:Modelo-metáforadeBradFrostconsideraátomos,moléculas,organismos,templatesepáginasnodesignweb.

SegundooesquemapropostoporBradFrost,épossívelfocarosesforços
dosdesignersedesenvolvedoresemconstruirosátomos,moléculaseorganismosquecompõemoproduto,emvezdefocarnaspáginascompletas. No
finaldoprojeto,emvezdeentregaras50páginas,oqueelepropõeéaentregadeumúnicolink(emHTML,nocasodeumsite),queilustracomo
esseselementosdeinteraçãosecomportam.

Apartirdaí,ficamaisfácilparaaempresamontaraspáginasemquestão:
bastaqueelareúnaessesdiversoselementosdeumjeitoquefaçasentidopara
osusuários(primeirooheader,depoisocampodebusca,depoisotítuloda
página,depoisumblocodetexto,depoisumagaleriadefotosetc.).

---

## GOSTA DESSE ASSUNTO?

Se você se interessa pelo tema, leia a documentação que Frost publicou em seu site e veja alguns exemplos de produtos que foram construídos inteiramente utilizando o conceito do design atômico: http://bradfrostweb.com/blog/post/atomic-web-design.

## 7.3 MAIS PADRONIZAÇÃO NÃO SIGNIFICA MENOS CRIATIVIDADE

Hoje em dia, existem diversas bibliotecas de padrões disponíveis online para consulta. Sites como o Pattern Tap (http://patterntap.com) catalogam padrões de interação de diferentes aplicativos, sites e produtos em um único lugar, permitindo inclusive que o visitante filtre os padrões por tipo (menus, galerias, paginação, formulários etc.).

Mas, apesar das inúmeras vantagens em se utilizar bibliotecas de padrões e da facilidade em encontrar referências na web de padrões que funcionam bem, é importante estar atento a um erro comum de alguns times: pensar que uma única solução de design pode resolver problemas de design diferentes de empresas diferentes.

As vezes, um modelo de paginação que funciona bem para a página de resultados de busca da Amazon pode não funcionar tão bem para uma galeria de imagens como o Pinterest. Diferentes contextos exigem diferentes pensamentos de design, que eventually levam a diferentes soluções de interface.

Isso sem contar que você pode estar perdendo a oportunidade de criar um modelo de interação original, icônico e que expresse a personalidade da sua marca.

---

# Gooooooooogle > 1 2 3 4 5 6 7 8 9 10 Next

Figura7.3: ApaginaçãodoGooglefogedoconvencionalecriaumdesign
icônicoparaamarca.

Porisso,aoencontrarumpadrãodeinteraçãoemalgumsite,éimportanteexaminá-lonosmínimosdetalhesparaentenderqualfoioproblema
quelevouàquelasolução.OresultadopodeterficadoincrívelnositeX,mas
nahoradetransportaramesmasoluçãoparaoseuprodutovocêpodeacabar
causandoumdesastreemsuausabilidade.

Seráqueoproblemadaquelaempresaeraomesmoquevocêestátentandoresolverparaoseuproduto?Quaismudançasvocêpoderiafazerpara
deixarasoluçãocustomizadaparasuainterfaceefazercomqueeleresolva
osproblemasreaisdosseususuários?

Essasperguntasnãosãofáceisdeseremrespondidas,masumaboaopção
parachegaraessarespostaétestarainterfacecomusuáriosreaisdoproduto,
simulandoumasituaçãorealdeuso. Opróximocapítulofalajustamenteda
etapadepesquisa:ahoradoprojetoemqueéprecisodeixarsuaconfortável
cadeiradeladoetestaroprodutocomquemmaisimporta.

## Gosta desse assunto?

Sevocêdesejasabermaissobreotemadestecapítulo, acesse http:
//fabricio.nu/padroes paraverlinksdebibliotecasdepadrõesonline.

---



---

Capítulo 8

# Testandocomusuários

Nafigura 8.1 temosainterfacedoaplicativodaBritishGasparasmartphones.
Oobjetivodestatelaéfazercomqueoprópriousuárioconsigafazeraleitura
domedidordegásdesuacasa,paraqueacontadomêssejaprocessadapela
empresa.

Atarefaésimples: ousuáriosóprecisaolharonúmeroqueapareceno
medidordegásqueestáinstaladoemsuacasaeentraromesmonúmerona
interfacedoaplicativo.

Sóquereparenodetalhe:nocantosuperiordireitoháumatalhoparaque
osusuáriosconsigamligaraluzdoflashdocelular.Umaespéciedeinterruptor,com“on/off”,queligaaluzdoflasheiluminaoambienteondeousuário
está.

---

11:50 AM

Gas

61, Forton Avenue,
Bolton BL2 6JE
Customer number:
85000002012

Enter your gas reading here

0 4 1
5 2
0 1 6 3 0
1 2 7 4 1
2 3 8 5 2

Cancel Next

Aferramentafoiadicionada, obviamente, porqueosmedidoresdegás
costumamserinstaladosemlocaisnãomuitoiluminadosdentrodascasasdos
usuários:embaixodapia,emumporãoescuro,ouemalgumlugarfechado
pertodacaixadeeletricidadeedeágua.Nadamaisjustodoquepermitirque
ousuárioilumineoambientecomapróprialuzdosmartphonequejáestá
emsuasmãos.

Masapesardeaideiaparecerumtantoóbviadepoisdepronta,chegaraté
elanãoétãosimplesassim. Esseéotipodeideiaquesurgeapenasquando
osdesignerstêmtotalconsciênciaeentendimentodequalocontextodeuso
doaplicativo.Provavelmente,emumdostestesfeitoscomusuáriosreaisno
contextorealdeusodoapp,algumapessoadevetercarregadoumalanterna
consigonahoradeiratéoporãomostrarparaodesignercomoéqueelafaz
paraveronúmerodomedidordegás.

Nodiaadiadecriaçãoedesenvolvimentodeinterfacesdigitais,émuito
comumqueosmembrosdaequipepassemlongashorasdodiasentadosem
suamesarabiscandooulayoutandocomodeterminadateladevefuncionar.
Sóqueexistemalgumasideiasquesósurgemquandovocêconheceemprofundidadequemsãoosseususuários,doqueelesprecisamequalorealcon- texto de uso daquilo que está sendo criado.

Além de gerarem novas ideias de funciona alizar pesquisas com usuários podem ser uteis

idades para os produtos, rea-ara:

- Validar se a solução de design que você criou realmente funciona;

- Encontrar possíveis problemas de usabilidade na interface;

- Testar se a solução é realmente útil para as pessoas;

- Observar a reação das pessoas à medida que usam o produto;

- Descobrir outras necessidades dos usuários que você nem sabia que existiam;

- Validar se a pessoa realmente usaria aquele produto em sua rotina ou se ela preferiria usar outros métodos ou ferramentas para resolver o mesmo problema.

## 8.1 SAIA DA SUA MESA COM MAIS FREQUENCIA

Veja a seguir um trecho de uma entrevista com Jared Spool, CEO da User Interface Engineering e coautor de alguns livros sobre User Experience e Testes de Usabilidade. Em uma de suas respostas, Spool explica que testes de usabilidade são mais baratos e simples de serem feitos do que se imagina.

## Entrevista com Jared Spool

"Alguns times de desenvolvedores parecem procurar por formas mais baratas e rápidas de validarem seu design. Usabilidade é frequentemente percebida como sendo muito cara. Você acha que os testes de usabilidade devem ser barateados? Perguntando melhor: teste de usabilidade, hot or not?

Um teste de usabilidade, em sua forma mais básica, custa basicamente nada. É um processo simples. Você senta do lado de alguém e o assiste experimentando seu design. Qualquer custo adicional vem da tentativa de adicionar rigor ao processo. Rigor não precisa ser caro, mas pode ser caro.

Pense que é como pintar uma casa. Uma pessoa pode fazer tudo praticamente sozinha, economizando uma boa quantia, mas provavelmente isso vai tomar muito tempo e, sem as ferramentas adequadas, resultado de alta qualidade. Mas vai ter pintado a casa

a não vai produzir um

A questão é quanto valem o tempo e a qualidade. Há uma relação entre quanto você investe e a qualidade e velocidade que você vai ter de volta. Compre uma escada, uns pincéis e rolos de melhor qualidade, tintas melhores e peça a ajuda de algum estudante colegial desempregado, e você terá uma pintura melhor em sua casa.

A mesma coisa acontece com testes de usabilidade. Investimentos inteligentes aumentam a qualidade. Mas há uma coisa que difere de pintar uma casa: pode ser um erro contratar alguém para testar para voce.

O principal benefício de qualquer projeto de teste de usabilidade não é o relatório de recomendações que é entregue no final. Nossa pesquisa mostra que o beneficio é a exposição que o time tem ao observar usuários reais utilizando seu design. Quanto maior essa exposição, melhores são os produtos entregues.

Se você contrata alguém para fazer o seu teste, bem, é mais ou menos como contratar alguém para curtir suas férias – a tarefa é feita, mas você perde a melhor parte. Então, o maior investimento em testes de usabilidade não é o dinheiro – que até pode ser não muito caro. É o tempo. Nossa pesquisa mostra que as equipes das organizações mais eficazes gastam pelo menos duas horas a cada seis semanas observando usuários interagirem com seus projetos. Cada membro da equipe.

E a experiência se paga muito rapidamente. O time agora sabe como é usar o design. Eles sabem quais mudanças tiveram o impacto que eles esperavam, e quais delas nem foram notadas. E eles veem como alguns problemas pequenos e irritantes podem arruinar soluções consideradas inovadoras.

É muito barato começar a praticar testes - se a dúvida é fazer ou não o investimento. Agora, se você estiver preocupado com os gastos, eu recomendo que você faça um produto realmente de baixa qualidade. Sempre haverá uma solução mais barata. (E é interessante observar que, se você quiser realmente fazer um produto de baixa qualidade, você consegue fazer muito rapidamente, também.)”

Muito interessante a metáfora que Jared fez sobre a pintura da casa.

As grandes agências e estudios digitais já enxergaram o valor dos testes com usuários para os negócios e passaram a incorporá-los naturalmente comopartedoprocessodecriaçãodeprodutosdigitais.

ExisteumasériedemétodosdepesquisacomusuáriosqueosUXdesignerscostumamrealizar:pesquisasquantitativas,entrevistasemprofundidade,
focusgroups,testesdeusabilidade,testesA/B,eyetracking,shadowing,diário
deusocontinuado–entreoutros.Naspróximasseções,vocêconferemaisdetalhessobre **doismétodosmuitocomuns** noprocessodedesenvolvimento
deinterfaces: ostestesdeusabilidadeeostestesA/B.Taismétodospodem
serutilizadostantopelopróprioUXdesignerquantoporumaempresaterceiraespecializadanoassunto.Ouentão,naausênciadeles,porpraticamente
qualquermembrodotimequeestejadispostoainvestigarmaissobreocomportamentodaspessoas.

## 8.2 Testes de usabilidade

Testesdeusabilidadetêmporobjetivoverificarafacilidadequeosoftware
ousitepossuideserclaramentecompreendidoemanipuladopelousuário.
São,pordefinição,qualitativos–ouseja,focammaisnaqualidadeeprofundidadedosresultadosdoquenecessariamentenonúmerodeusuáriosque
participam.

---

DELL

Veja a definição de Testes de usabilidade publicada na plataforma
Corais.org(http://corais.org/node/97):

“Usuáriospotenciaisdainterfacesãoincentivadosausá-lanumambiente
monitorado,ondesuasaçõessãogravadaseanotadas.Umprofissionalfacilitadorficaaoladodousuárioparaguiá-lopelotesteeincentivarqueverbalize
seusproblemasedesconfortos.

Numasalaseparada,podemestaroutrosmembrosdaequipededesign
dainterfaceparaobservarotesteaovivoseminterferirnocomportamento
dousuário.Apósoteste,osdadossãoanalisadoseégeradoumrelatóriocontendorecomendaçõesparaaequipededesigneoconsultorficaàdisposição
paradiscutirsoluçõesparaosproblemasencontrados.

Com base em pesquisas de perfil dos consumidores, é recrutado um
númeroreduzidodeusuáriospotenciais,representandoosprincipaisgrupos
deperfis. Cadausuáriotestaráainterfaceseparadamente,numasessãoque
duraaproximadamente1hora.Aofinaldasessão,eledevereceberumbrinde
paracompensarotempodispendido.

No início do teste, o facilitador explica por que a empresa está promovendoostestese, emseguida, apresentaainterface, pedindoaopinião do usuário sobre aspectos subjetivos da interface, como beleza, atratividade e etc. Depois disso, o usuário é requisitado a realizar determinadas tarefas, como por exemplo "descobrir se o aparelho X possui uma funcionalidade Y". Ao final, é repassado ao usuário um questionário de satisfação para registrar seu conforto ao realizar as tarefas.

As tarefas que o usuário realiza são escolhidas com base na análise cruzada de log (estatísticas de navegação), de e-mails de suporte e do atendimento online. Essas fontes já possuem dados que servem como pistas para encontrar os principais problemas de usabilidade."

Entre os objetivos mais comuns dos testes de usabilidade, estao:

- Averiguar a aceitação de um novo propessoas estão dispostas a começar a usa problema que elas têm?

luto no mercado: será que as o seu produto para resolver o

- Avaliar a usabilidade do produto: a tarefa sem dificuldades, em um tem esforço cognitivo?

pessoas conseguem completar a o aceitável e com baixo nível de

- Comprar a usabilidade de várias versões diferentes da mesma interface: será que os usuários têm mais facilidade de utilizar botões ou gestos para realizar uma tarefa? Será que uma versão funciona melhor do que a outra? Testes de usabilidade podem ser uteis para entender o que funciona e o que não funciona em cada uma das versões testadas.

- Identificar o motivo que leva as pessoas a usarem ou a abandonarem o produto: será que estão tendo dificuldade em um passo específico do fluxo? Será que a interface não está fornecendo as informações suficientes para o que o usuário complete a tarefa? Será que eles estão tendo dificuldade em entender o que está acontecido com o sistema à medida que interagem com o produto?

- Coletar opiniões e ideias de melhorias: durante os testes, os usuários fazem muito comentários sobre o que gostam e o que não gostam em determinada solução de interface, em alguns casos podendo até fazer sugestões de funcionalidades que eles gostariam de ver naquele produto.

---

• Mediraperformancedoproduto:quantotempoaspessoaslevampara
concluiraatividade?Quantospassossãonecessários?Qualaporcentagemdaspessoasqueconseguemefetivamenterealizaratarefacom
sucesso?

Apósumasessãodetestes,écomumqueoUXdesigner(ouaempresa
terceiracontratadapararealizá-los)crieumrelatóriocomosprincipaispontosinvestigadoseasprincipaismelhoriasaseremfeitasnoproduto.Depois,
écomumqueelessereúnamcomtodososmembrosdotimeparapensarem
soluçõesparaaquelesproblemas.

Acadanovociclodetestes-análise-soluções,oprodutovaiamadurecendo
eficandomaisfácildeusar. Algumasempresasrealizamostestesnodecorrerdoprocessodedesenvolvimentoeantesmesmodeoprodutoserfinalizado,permitindoqueessasmelhoriassejamimplementadaslogonaprimeira
versão do produto. Outras empresas preferem uma abordagem diferente:
primeirolançamoprodutoedepoistestamcomusuáriosparaconseguirem
capturar as melhorias necessárias para as versões futuras. Os dois métodossãoválidoseomaisimportanteéqueelescolocamasnecessidadesdos
usuárioscomofococentraldassoluçõesdodesign.Aliás,éessetipodeiniciativaquecolocao“U”nonome“UserExperienceDesign":seoseudesignnão
levaemcontaousuário,entãotalvezvocênãoestejapraticandoUXDesign,
masapenasDesign.

## 8.3 Desculpas comuns para não testar com usuários

Apesardeostestescomusuáriosseremcomprovadamenteeficazesparadesenvolverprodutosquesejamfáceisdeusar,muitasempresasaindanegligenciamessaetapadoprocessoeacabamcriandoprodutosbaseadosapenasna
intuiçãodosdesigners.

Intuiçãoéumelementobastanteválidonaequação,masnãopodesero
único. UmdospilaresdoUserExperienceDesignéofatodeque **vocênão
éousuário.** Esevocênãoéoseuusuário,écertamentedifícilpreveroque
elevaipensar,sentiredesejarnahoraemqueestivercomoseuprodutonas
mãos.

---

Obviamente, existe a questão dos custos e do prazo. Incorporar testes com usuários dentro do processo de Design tem um certo impacto nas horas gastas e no prazo final da entrega do produto. A verdade é que muitas vezes é preferível adiar o lançamento do produto em algumas semanas, mas ter certeza de que a solução é realmente simples de usar – testada e aprovada pelos próprios usuários do site.

Veja a seguir uma lista com as 10 desculpas mais comuns que as pessoas utilizam para não fazerem testes com usuários, segundo o site Cardinal Path (http://www.cardinalpath.com/top-10-lame-excuses-for-not-doing-usability-testing):

Eu não tenho um laboratório de usabilidade. Você não precisa de um laboratório completo, com equipamentos de última geração e com sala de espelho. De fato, você nem quer ter um. Laboratórios muito elaborados podem deixar os participantes nervosos e influenciar no resultado. Um lugar mais casual traz melhores resultados para os testes.

Eu não tenho um software de gravação de tela. Bom, existem softwares gratuitos disponíveis online que fazem isso, ou então versões "Trial" de softwares pagos que você pode usar por alguns dias. E se você não puder instalar um software para gravar o que está sendo testado, faça o teste mesmo assim. Você sempre aprenderá alguma coisa dos usuários.

Eu não sei fazer uma análise estatística Testes de usabilidade são qualitativos, por insights, não de estatísticas.

a dos resultados. Não precisa.
atureza. Você está em busca de

Eu não conheço participantes suficientes. Já que você não está procurando por estatísticas, e sim por insights, teste com 3-5 usuários. Na verdade, testar com 1 usuário já é infinitamente melhor do que testar com o usuário.

É difícil encontrar usuários no perfil demográfico que estou procurando. Então teste com os participantes que mais se aproximem do perfil. A coisa mais importante é testar com pessoas que usariam o serviço. O perfil demográfico pode ser aproximado.

Meu produto ainda não está finalizado. Exato. Esse é o ponto. Quanto antes você testar, melhor. Teste em protótipos. Teste em wireframes. Teste no verso do guardanapo. Se você esperar para testar com o produto já pronto, será muito mais difícil fazer mudanças nele depois do teste.

---

Eu não tenho tempo. Faça o tempo aparecer. Não precisa de muito. Se for preciso, faça testes remotos (por Skype ou com serviços como o usertesting.com). Você conseguirá insights em poucas horas.

Eu não tenho budget. Então faça os testes você mesmo. Tente liberar tempo de outras atividades para isso.

Eu nunca fiz antes, não tenho ideia de como aplicar um teste. Aprenda.
Leia sobre o assunto, ou então aprenda fazendo.

Meu produto está funcionando bem, não preciso de teste. Ok, essa desculpa quase ninguém usa, porque todo mundo sabe que qualquer produto pode melhorar depois dos testes. O que significa que todos os produtos precisam de testes.

## 8.4 INCORPORANDO PESQUISA COM USUÁRIOS EM SEU PROJETO

É muito comum ouvir de profissionais que
dade ou empresas de desenvolvimento de
a fazer mais pesquisa".

trabalham em agências de publici- software que "precisamos começar

Ou "precisamos incorporar pesquisa no processo."

Ou "precisamos conseguir mais verba para fazer pesquisa."

Ou "se tivéssemos mais tempo, poderíamos ter feito pesquisa."

E então "Pesquisa" fica sempre sendo esse tabu, essa coisa intangível cuja importância as pessoas adoram reforçar, mas ninguém tem muita força de vontade de fazer. Em menos de metade dos projetos em que trabalhei houve mobilização suficiente para fazer algum tipo de pesquisa que envolvesse os usuários reais do produto. E não, isso não é exclusividade dos brasileiros: fora do país o índice é praticamente igual.

Mas as coisas estão mudando. Aos poucos, mas estão mudando. Veja a seguir algumas questões para se pensar e para tentar conseguir incorporar pesquisas com usuários com mais frequência em seus projetos.

## E se a pesquisa não fosse uma etapa?

Ao contrário do que muita gente imagina, a tal "Pesquisa" não precisa ser uma etapa separada, que acontece logo no começo do projeto.

---

Não precisa necessariamente ter data de início, data de término, parceiros contratados, CNPJ, burocracia, prancheta ou formulário. Pesquisa não precisa ter letra maiúscula.

Pesquisa é simplesmente pesquisa. É simplesmente você consultar o seu usuário final para validar uma hipótese ou teoria que você tenha. Mas também não obrigatoriamente; pesquisa pode ser puramente sentar com o usuário e conversar sobre assuntos randômicos, saber das coisas que ele tem feito e o que ele achou do celular novo que ele comprou na semana passada. Isso não deixa de ser uma forma de estar mais próximo do seu usuário. Bom, melhor do que passar o projeto todo sentido no conforto da sua cadeira do escritório.

## E se a pesquisa não fosse uma escolha

Muitas vezes, os times se reúnem para decidir se é possível ou não realizar pesquisa com usuários em um projeto. Mas e se isso não fosse escolha para ninguém? Ao invés de tratar pesquisa como item "opcional", considere embutir em seus custos e não dar escolha para o cliente. Se o cliente não pode optar entre "escopo completo com pesquisa" ou "escopo reduzido sem pesquisa", ele acaba comprando o escopo do projeto, e pronto. Tenha certeza de que dentro desses escopos já exista uma pequena gordura de horas destinadas a isso – ninguém precisa saber disso a não ser o UX designer e o gerente de projetos

Em um projeto recente do qual participei foi assim: uma manhã por semana, dois UX designers fazendo pesquisa de campo. No caso desse projeto, o local da pesquisa é uma das lojas da marca, onde os produtos são vendidos.

O gerente de projetos também não teve muita escolha. Informamos para ele que às terças-feiras de manhã nós não estariamos disponíveis (do mesmo jeito que você informa seu chefe que toda sexta de manhã você precisa chegar mais tarde porque vai levar sua avó na aula de capoeira). A regra era "bloquear o calendário no Outlook" e não se fala mais nisso. Aos poucos, a rotina do restante do time foi se adaptando a essas manhãs ocupadas com pesquisa, e depois de um tempo as pessoas já esperavam ansiosas a gente voltar para o escritório, querendo saber como tinha sido a pesquisa naquele dia.

---

## E se os resultados não fossem tabulados

Esse também é um vício de quem está acostumado a fazer pesquisas muito grandes (especialmente as que envolvem parceiros contratados). Sempre se espera um relatório formal, com os dados tabulados e algumas recomendações do que deve e do que não deve ser feito em relação ao design do produto após a pesquisa.

Mas não precisa ser assim. Nesse mesmo projeto que mencionei, no caminho de volta para a agência os UX designers já conversavam sobre o que aprenderam naquelas duas horas de pesquisa e já chegavam ao escritório com 3 bullet points que resumiam os aprendizados do dia. Sem precisar de reunião formal, sem nem precisar sentar na mesa para passar nada a limpo: no próprio táxi nós já escrevíamos o resumo dos resultados e na própria tarde da terça-feira já começávamos a compartilhar com o time o que aprendemos.

## E se a pesquisa não fosse muito planejada?

Planejar demais a pesquisa pode significar dois riscos para o projeto. O primeiro deles é você gastar horas demais planejando o que vai ser perguntado, e esse superplanejamento acabar saindo caro. O segundo é você ensaiar demais e não fazer nunca, porque sempre vai ter algo no projeto que tem prioridade mais alta do que a pesquisa em si.

Antes de sair para o primeiro dia de pesquisa, nós nos reunimos por 15 minutos para combinar as regras do jogo, e o resto foi improvisação. Só vale tomar cuidado para não "planejar de menos" a pesquisa e invalidar os resultados por causa de algum erro primário (como entrevistar o público-alvo errado ou agir com parcialidade).

Por sorte, para esse projeto nós contávamos com o apoio de uma loja da marca que estava ciente de que nós estariíamos por la todas as terças-feiras de manhã fazendo perguntas para os vendedores e para os compradores. Aos poucos, fomos nos familiarizando com os vendedores e ganhando a confiança deles para que eles compartilhasem mais informações conosco.

## E se cada pequena decisão de design fosse validada?

É claro que você não pode chegar para o consumidor e perguntar o que eleachadonovobotãoquevocêadicionounasemanapassada. Mascomo
aspesquisasacontecemtodasemana,aospoucosvocêvaiseacostumando
adirecionaraconversaparasondarseaquelafuncionalidadenaqualvocê
trabalhounasemanapassadateriaboaaceitaçãoounão. Tudocommuito
jogodecintura,éclaro,paranãodeturparoudirecionardemaisosresultados.

## Quaisosbenefíciosdesse“método"?

Resumindoeconsolidandotudoemumaúnicalista:

• Custodepesquisa“invisível”,diluídonaprópriaverbadoprojeto.

• Nadadeinvestirmuitotempoemumaideiamalucaquedepoisserá
jogadafora: emmenosdeumasemanaumanovaideiajápodeser
validadacomosusuáriosparadescobrirseaquelaéounãoumaboa
ideia.

• Osinsightscolhidosempesquisaservemnãoapenasparavalidarnovasideiasquenascemdentrodaagência,mastambémcomopontode
partidaparanovosbrainstormsondeotimededesignersedesenvolvedorescriamnovasfuncionalidadesparaoproduto.

• Àmedidaquevocêvaiconversandocommaisconsumidores,épossívelcriarpersonasparaoseuprojeto:umadocumentaçãodequemé
esseconsumidor,qualoseuperfildemográfico,quaisassuasnecessidades,desejoseanseiosquandoestãobuscandoumasoluçãoparaseu
problema.

• Vocêacabaconhecendoumoutroladodobusinesscomoqualnão
teriatantocontatoseaspesquisasnãotivessemsidofeitas:opontode
vistadovendedordoproduto,quepassaodiatododentrodaloja–e
osinsightsquetimedemarketingnenhumconseguiriapassarparao
seutime.

• Maisconfiançadosdesignersnahoradeapresentarasideiasparao
cliente,jáqueelasjáhaviamsidopré-testadascomoconsumidorfinal.

---

• MaisconfiançadoclientenaagênciaeespecialmentenotimedeUX
Designdoprojeto.

## Equantoissocustanofimdascontas?

Essa é difícil precisar. Mesmo nesse exemplo que mencionei (das
pesquisasàsterças-feirasdemanhã).

Talvezseeunãoestivessefazendopesquisaàsterçasdemanhãeuestaria
usandoessetempoparaadiantaroutrastarefasdoprojeto.Mastambémcorreriaoriscodeeutergastadoessetempodistraídonavegandoporaíoupreso
emalgumareuniãoimprodutiva.

No fim das contas, o custo foi absorvido no montante do projeto e o
clientenemsentiunobolsoopesodetermosfeitopesquisa. Tambémnão
precisamos“comunicaroficialmente”nadaparaele;elesóficousabendoque
fizemospesquisaquandocomeçamosacompartilharcomeleinsightscolhidosdosconsumidoresduranteoprojeto. Foiaíqueelenosajudouagarantirquealojaestivessesemprepreparadaparanosreceber,todasemana,às
terças-feirasdemanhã.

É claro que esse exemplo não é uma “fórmula mágica” de como fazer
pesquisascomusuários, masderepenteéumempurrãoparaquemesteja
comvontadedeincorporaressemétododentrodoprocessodeDesignenão
saibaporondecomeçar.

Émuitocomumouvirreclamaçõesdeoutrostimesdizendoqueosfatoresexternos(verba/prazo)nãofavoreceramarealizaçãodepesquisacom
usuários, maséraroouvirhistóriasdetimesquetoparamcorreroriscoe
promoveramudança. Comotudonessavida,paraquequalquermudança
aconteçaéprecisoquebraralgunsparadigmaseseaventurarumpoucomais
(mesmoquemuitasvezesvocêquebreacaraporcausadisso).

## 8.5 Os números não mentem

Umoutroladodaspesquisascomusuáriossãoosmétodos **quantitativos.**
Nasplataformasdigitais,épossívelmedirumasériedenúmerosquedizem
respeitoàformacomaqualaspessoasinteragemcomoseuproduto:tempo
denavegação,quantidadedecliques,linksmaisclicados,ordemdofluxode navegação,taxasdeabandono,taxasdeconversãoetc.Bastaplanejamentoe
umaferramentaquepermitamedircadaaçãoqueousuáriotomaenquanto
interagecomoseuproduto(oGoogleAnalyticséumótimoexemplodeferramentacomessafinalidade).

Acontece que, apesar de muitas vezes a ferramenta quantitativa de
mediçãodedadosestarinstaladaefuncionandocorretamente,otimededesignersedesenvolvedoresacabamesquecendodeolharparaessesnúmeros
paraaprendersobreocomportamentodaspessoas.

Emmuitosprojetos,essaanálisedasmétricasdeumsitepodegerarinsightsvaliososparaosdesigners, ajudá-losaidentificarproblemaseainda
informarexatamentequalotipodeconteúdoqueosusuáriosmaisprocuram
nosite.Umexercíciosimpleséodeolharparaaspalavrasmaisdigitadasem
umcampodebuscaqueestejadisponívelemseusite: essalistadepalavras
podeajudarainformartodootimesobrequaisosconteúdosqueosusuários
maisprocurameoprodutopodeserredesenhadoparapriorizaressestemas
maisprocurados.

Existem vários métodos de pesquisas quantitativas. A seguir, você vai
aprenderumpoucomaissobreosTestesA/B,umdosmétodosquemaistêm
sidousadosnasempresas–destartupsagrandescorporações.

## 8.6 Testes A/B

TesteA/Béummétodonoqualsetestamduasversõesdeumamesmatela
(versãoAeversãoB),ouemalgunscasosdiferentesversõesdeumpequeno
elementodatela(umbotão,umlink,ummenuetc.).Emmuitosprojetos,o
testeA/Béusadoparaidentificarmudançasnapáginaquepodemprovocar
resultadospositivosounegativosnointeressedosusuários.

Normalmente,otesteA/Bfuncionadaseguinteforma: metadedosvisitantesdeumsitevêaversãoA,emetadevêaversãoB.Depoisdealguns
diasqueotesteestánoar,épossívelaveriguarosresultadosdecadaumadas
versõeseperceberqualdelasfuncionamelhor.

Nocasodeumalandingpage,porexemplo:emqualversãoosusuários
clicaramnobotãoprincipalparabuscarsabermaissobreoquevocêestava
oferecendo? Em qual versão os usuários decidiram se cadastrar no site e emqualversãoelesabandonaramapágina? Qualfoiotempodenavegação
dousuárioemcadaumadasduasversões? Emqualdelasosusuáriosconseguiramprosseguirsemdificuldadespelofluxo?

UmadasgrandesvantagensdostestesA/Bemrelaçãoaoutrostiposde
testeéa precisão,jáqueelesoferecemumfeedbackrealdemercado. Em
algunstiposdepesquisaqualitativos,écomumqueosusuáriosdigamuma
coisa, masnapráticafaçamoutra. Nostestesquantitativos, ahistóriajáé
muitomaisrealista,vistoquevocêestámedindoainteraçãorealdaspessoas
comoproduto.

---

# Capítulo 9

# Ospecadosdeusabilidade

Problemasdeusabilidadesãomaiscomunsdoqueparecem. Quantasvezes
vocêjánãoteveproblemascompainéisdeelevador,comosbotõesdeum
controleremotooucomasfunçõesconfusasdeumcaixaeletrôniconahora
desacardinheirooufazerumatransaçãobancária?

---

OTIS

Figura9.1:Qualbotãoeudevoapertarparasubirequalbotãodevoapertar
paradescer?

Damesmaformaquearegranúmeroumdocomércioéque“ofreguês
sempre tem razão”, também funciona assim com usabilidade: **osusuários
sempreestãocertos.** Porissomesmoessetipodeproblemaéchamadode
“problemadeusabilidade”eénecessariamenteatribuídoàinterface,enãoà
pessoaqueautiliza.Seumusuárionãoconseguerealizarumatarefadentro
doseusite,aplicativoouqualquertipodeinterfacequeseja,oproblemanão
édousuário;oproblemaédodesign.

Outroproblemacomumemváriosformuláriosdisponíveisporaí:ofato
deobotão“Enviar”eobotão“Limpar”estaremmuitopróximosumdooutro
eseremmuitoparecidosvisualmente. Ousuáriopodeacabarclicandoaci- dentalmentenobotão“Limpar”eperdertudooquedigitounoformulário.
Aliás,seráqueobotão“Limpar”érealmentenecessárionessecaso?

E-mail:
Cidade:
Estado: AC
Empresa:
Site: http://www.
Como nos achou?
(Google, Yahoo, Cadê, etc.):
DDD e Telefone
(somente telefone fixo):
Mensagem:
Enviar Formulário
Limpar

Ofatoéqueaindahojemuitossiteseaplicativosfracassammiseravelmenteporcausadeproblemascomoesse. Quandoousuárionãoconsegue
realizaratarefadesejadaemdeterminadosite,émuitocomumqueeleabandoneepartaparaoutra. Afinal,comoémuitocomumafirmarnouniverso
deUX,oconcorrenteestáapoucoscliquesdedistância. Eéverdade. Você mesmo já deve ter passado por isso: se irritou ta fazer suas compras em outro lugar.

nto com um site que decidiu

Ao mesmo tempo, produtos fáceis de usar têm chamado cada vez mais atenção das pessoas e garantido usuários fiéis com o passar dos anos. Se a pessoa se sente confortável ao utilizar um produto, é natural que ela o utilize com frequência e acabe recomendando para amigos que também têm as mesmas necessidades que ela.

Problemas de usabilidade podem se materializar de várias formas e podem ter origem em vários aspectos da execução de um produto. Um site que demora para carregar, um botão que não deixa claro qual a ação que será tomada ao clicá-lo, um link que não tem aparência de link, uma mensagem de erro que não explica como corrigir o problema, um menu complicado de navegar, uma ferramenta de busca que não apresenta resultados relevantes etc.

Outros problemas podem ser menos visíveis e serem caracterizados pela ausência de algo. Uma listagem de aparelhos celulares em um e-commerce sem a opção de filtrar os produtos por cor, capacidade ou sistema operacional. Uma listagem de resultados de busca sem nenhum tipo de paginação para permitir que o usuário veja poucos itens por vez. Um site sem ferramenta de busca, que força os usuários a utilizarem o menu para encontrar o que estão procurando.

## 9.1 COMO PREVENIR ERROS DE USABILIDADE

Mas se usabilidade é tão importante para um produto suceder ou fracassar, como garantir que o seu produto não peque nesse quesito?

## Através de um bom design (e um bom designer)

Muitos problemas de usabilidade podem ser evitados antes mesmo de o produto começar a ser desenhado. O próprio fato de possuir um UX designer no time, que já tenha experiência em desenhar interfaces há muitos anos, pode evitar que problemas comuns acontecam. Um profissional como esse já teve experiências anteriores em desenhar interfaces e testá-las com usuários, o que normalmente significa que ele já sabe quais são as soluções de navegação einteraçãoquefuncionammelhoremcadacaso.

## Atravésdetestescomusuários

Masninguéméodonodaverdade.Mesmoprofissionaiscomváriosanos
deexperiênciaacabamcometendodeslizesdeusabilidade,oqueéaindamais
comumquandoseestádesenhandoumprodutonovo,semprecedentesno
mercado.

Éporissomesmoqueexistemmétodosdeverificaçãodausabilidadedos
produtos.Testesdeusabilidade,análisedemétricas,entrevistasemprofundidadecomusuáriosreais–todosessesmétodosajudamaaveriguarasolução
criadaegarantirqueelaestejarealmenteajudandoosusuáriosarealizarema
tarefadesejada.

Mesmoinformalmenteépossívelverificarseasoluçãocriadafunciona:
bastaodesignermostrarasoluçãoparaoutraspessoasdentrodoprópriotime
e,comcerteza,essaspessoasterãocomentáriosconstrutivossobrecomomelhorarausabilidadedaquelainterface. Profissionaisquetrabalhamcomdesignedesenvolvimentodeprodutosdigitaiscostumamterolhoafiadonahora
deidentificarpotenciaisproblemasdeusabilidade,entãonadamaisjustodo
queconsultá-losàmedidaqueainterfaceestásendocriada.

## Atravésdeboaspráticasdeusabilidade

Existemmuitoslivros,blogselinksquefalamjustamentesobreasboas
emáspráticasdeusabilidade. Tambémexistemsitesespecializadosemcatalogarsoluçõesdedesignportipo(menus, buscas, botões, listagens, paginaçõesetc.).Umbomtimededesignestásempreseatualizandoemrelação
aospadrõesdeinteraçãoquefuncionammelhoremcadacaso,esabeonde
buscarboasreferênciasnahoradedesenharumnovoproduto.

Tambémexistemalgumasregrasuniversaisdeusabilidade(algumasdas
quaismencionadasnoscapítulosanterioresdestelivro), quevalemapena
conheceretersempreemmente,independentedocontextodeuso.

---

## 9.2 Opções demais, opções de menos

```
Document1 - Microsoft Word

File Edit View Insert Format Tools Table Window Help
Type a question for help

Normal Times New Roman 12 B I U

New Frame Left New Frame Right New Frame Above New Frame Below

Insert Word Field

Body text Update TOC

Favorites Go Document1

0 Words Regount

Edit Text... Security...

All Entries New... Final Showing Markup Show

Draw AutoShapes

Page 1 Sec 1 1/1 At 1" Ln 1 Col 1 REC TRK EXT OVR
```

Nemtudoestarávisívelnainterfaceotempotodo.Aindabem.Ocultaritens
dainterfacedoprodutopodeserbastantesaudávelparadeixá-lomaissimples,fácildedigerireagradáveldeusar. Especialmenteeminterfacespara
dispositivosmóveis,ondealimitaçãodetamanhodeteladeixaaindamais
difícilatarefadelayoutartodososcomandosquevocêgostariadecolocarno
seuproduto.

Osbotões(ougatilhos)queiniciamasinteraçõespodemservisíveisou
invisíveis.Podeounãohaverumtexto,botãoououtradicavisualquemostra
aosusuáriosquealgumadeterminadaaçãoépossívelali.

Independentedotipodeprodutoquevocêestácriando,nemtodosos
itensestarãoimediatamenteencontráveisassimqueousuárioabreoproduto.
Naverdade,teritensocultoscontribuiparadarmaisimportânciaaositens
queestãovisíveisnatela,criandohierarquiaparaasaçõesquesãomaisimportantesnaquelemomento.

Asaçõesnãoprecisamestartodasvisíveisaomesmotempo,maselaspre- cisamser“descobríveis”dealgumaforma.Sejaporacidente,porumtutorial,
porbocaabocaentreaspessoasqueutilizamoproduto,porumlinkdeajuda
contextualetc.

## 9.3 Os gatilhos invisíveis

EssetipodeaçãoocultaéchamadapelosprofissionaisdeUXde“gatilhosinvisíveis”(invisibletriggers),esãomaiscomunsdoquevocêimagina.Emdispositivoscomsensores(celularescomtouchscreen,microfone,acelerômetro
etc.) osgatilhosinvisíveiscostumamseraindamaisfrequentes–especialmenteporquenemsempreasaçõessãoativadasexplicitamenteatravésde
umbotão.

Home Connect Dashboard My

Pull down to find...
Mark Murphy
Put all your project's dependent JARs in
libs/, not in other directories, to help
clear up some R17 tools problems.
Android
#AndroidT tip for Gmail: If you use Priority
inbox, use settings to only sync
important mail to save on battery and
data goo gl/MBLaz
iPhon.fr
Les apps iPhone habituellement
payantes devenues gratuites de ce mardi
bit.ly/HaMNVl
Capptain
Russian Money into French Clouds: App.

Mark Murphy
Put all your project's dependent JARs in
libs/, not in other directories, to help
clear up some R17 tools problems.
Android
#AndroidT tip for Gmail: If you use Priority
inbox, use settings to only sync
important mail to save on battery and
data goo gl/MBLaz
iPhon.fr
Les apps iPhone habituellement
payantes devenues gratuites de ce mardi
bit.ly/HaMNVl
Capptain
Russian Money into French Clouds: App.

Figura9.2: NoTwittereemoutrosaplicativos,você‘puxa’ainterfacepara
baixoparaatualizaralista.

Algunsexemplosdegatilhosinvisíveis:

• OscomandosdevozdaSiri,noiPhone;

---

• O“releasetorefresh”dotwitter;

• BalançaracabeçapositivamenteusandooGoogleGlass;

• SacodirocelularparadesfazeroquevocêdigitounoWhatsapp;

• OsatalhosnocantodateladoMacOS;

• Torneirasdebanheiroquesãoativadascomaaproximaçãodamão.

Apesardeosgatilhossereminvisíveisnessescasoslistadosanteriormente,
asregrasdosistemaprecisamserclaramentecomunicadasparaosusuários,
sejaantes,duranteoudepoisqueaaçãoacontece. Aausênciadefeedback
podecausarconfusãoparaosusuários,aindamaisquandonãoestãoclaras
asregrasqueiniciamdeterminadaação(porqueseráqueoWhatsappdeletou
oqueeutinhaescrito?).

James Douglas Hawes That's clearly a Like · Reply · 24 · Yesterday at 9:27a 4 Replies · 8 hours ago

Baruch Weissman The definition given verb...
Like · Reply · 8 · Yesterday at 9:59am View more comments

Facebook:asregrasdecomoainteraçãofuncionasãoexplicadasantesde
elaacontecer(“Vejamaiscomentários”).

---

Personal List
Pull to Create Item
Mow the lawn
Buy groceries

Clearapp:asregrassãoexplicadasenquantoainteraçãoestáacontecendo
(“Puxeparabaixoparacriarumnovoitem”).

you get the
documents I sent you?
Yep, sure did thanks!
Undo Typing
Undo
Cancel
nd
O W E R T Y U I O P
A S D F G H J K L
Z X C V B N M

Whatsapp:asregrassãoexplicadasdepoisqueousuáriochacoalhaotelefone. Nessecaso,éprecisodaraousuárioaopçãodefacilmenterevertera
ação.

---



---

# Capítulo 10

# Negligenciandoaperformance daspáginas

A performance das páginas tem um impacto severo na experiência do
usuário.Segundosamaisnocarregamentodeumsitepodemsignificarfrustração para os usuários e, consequentemente, menores taxas de conversão
paraempresas.

---

As pessoas estão cada vez menos pacientes com páginas que
demoram para carregar. Um estudo recente feito pela Universidade de Massachusetts (http://connecticut.cbslocal.com/2013/01/10/
study-streaming-video-viewers-lose-patience-after-2-seconds/) mostra
queusuáriosperdemapaciênciacomvídeosapósos2segundosdeespera.
Omesmoseaplicaapáginasweb.Aindamaisselevarmosemcontaofatode
quemaisemaispessoasestãoacessandoawebatravésdeseusdispositivos
móveis:muitasvezesabaixaqualidadedeconexãofazcomqueaexperiência
dousuáriosejafrustranteouatécatastrófica.

## 10.1 O impacto da performance das páginas

Vocêjádeveterpassadoporisso. Entraremumsiteesedepararcomuma
páginaquecarregadeformaextremamentelenta,imagenspesadas,elementosnãootimizadosparawebelayoutnãootimizadoparaodispositivoem
queestásendovisualizado.Issosemcontarossitesquecolocamum“Loading”logonaentrada,achandoqueissobastaparaqueosusuáriosfiquemali
paradosvintesegundos(paraserotimista)esperandoapáginacarregar.

Comocrescimentodeempresasconcorrentesqueoferecemserviçossimilares(todasacessíveisapoucoscliquesdedistância),émuitocomumqueas
pessoasdesistamepartamparaumoutrositequeconhecemesabemque
funcionamelhor. Mesmoquedeformanãoconsciente, tempoéumfator
decisivonapercepçãodaspessoassobredeterminadoserviço.

---

Departamento de Transporte

Figura 10.1: Quantas vezes você já preferiu pagar mais caro e renovar sua
carteirademotoristaemumdespachante,emvezdeencararasfilasintermináveisdo(muitasaspas)Poupatempo?Oprincípioéomesmo.

Nocasodosdispositivosmóveis,aindaéprecisolevaremcontacommais
atençãoocontextoemqueositeéacessado.Cincosegundosnafrentedoseu
computadornãosãoofimdomundo.Mascincosegundossegurandoocelularnafiladobancoquandosuavezestáprachegarpodemserincrivelmente
frustrantes.

## 10.2 Uma batalha de muitas frentes

Obviamente,essaéumabatalhaquenãoselutasozinho.

Primeiro,vocêprecisatercertezadequetodososmembrosdotime(designerseprogramadores)estãocientesdequeessarelaçãoentreperformance
eexperiênciadousuárioexiste, paraqueelesjácriemoprodutocomisso emmente. Emoutroscasos,vocêprecisaconvencerogerentedeprojetosa
reservaralgunsdiasdojáapertadocronogramaparaqueotimeconsigafocar
emresolveressesproblemasdeperformanceeotimizaropesoedesempenho
dosite.Eemoutroscasos,vocêprecisaconvenceroclienteainvestiralguns
cruzeirosamaisparaqueessaotimizaçãoaconteça.

Comoa“experiênciadousuário”éalgobastantesubjetivo,alguémpode
argumentarqueaperformancenemtemtantoimpactoassim.Jáouviclientes
falaremque“seoconteúdoébom,aspessoasesperamcarregarsemproblemas”.

É.

Umaformadecontornaressetipodeargumentaçãoémostrarevidênciasnuméricasemaistangíveisdecomoessarejeiçãodosusuáriosporsites
pesadosimpactadiretamentenasvendas. Quandopesanobolso,ocliente
costumapensarmelhorsobreoassunto.

Vejaaseguiralgunsestudosdecasorecentessobreboasemáspráticasem
relaçãoàperformanceecomoelasafetaramdiretamenteoengajamentodos
usuárioscomositeouoretornosobreinvestimento(ROI)paraasempresas:

• Usuários esperam páginas carregarem em dois segundos. Depois do terceiro, até 40% dos usuários abandonam o site.
(http://www.mcrinc.com/Documents/Newsletters/201110_why_
web_performance_matters.pdf)

• AAmazonnotouque100milissegundosdeesperarepresentamum
declíniode1%nasvendas(http://sites.google.com/site/glinden/Home/
StanfordDataMining.2006-11-28.ppt?attredirects=0).

• O Google perdeu 20% de lucratividade e tráfego de usuários por
causa de um aumento de meio segundo no tempo de carregamento
de suas páginas de resultados (http://glinden.blogspot.com/2006/11/
marissa-mayer-at-web-20.html).

• A Akamai mostra em uma pesquisa recente como 75% dos compradores online que experienciam algum tipo de congelamento,
link quebrado ou página que demora muito para carregar deixam de comprar daquele site (http://www.akamai.com/dl/reports/Site_
Abandonment_Final_Report.pdf).

• OGoogleMapsrealizouumestudoqueapontouquereduziropesoda
páginade100KBpara80KBfezcomqueotráfegoaumentasse10%na
primeirasemanae25%nastrêssemanasseguintes.

• OtimededesigndoEtsypercebeuumaumentonataxaderejeição
em12%emdispositivosmóveisquandoresolveramadicionarmaisimagensnapágina,numtotalde160KB.

• A DoubleClick removeu um redirect de uma página (aquela
troca de URL que você às vezes nem percebe que aconteceu)
e viu um aumento de 12% no acesso da página em dispositivos móveis (http://doubleclickadvertisers.blogspot.com/2011/06/
cranking-up-speed-of-dfa-leads-to.html).

• AAmazonverificouemtestesquecomprimirimagensemJPEGem
umapáginareduzaquantidadedebaterianecessáriaparacarregá-la
em um dispositivo móvel em até 20%. No Facebook, que tem mais
imagens,essaeconomiadebateriachegaa30%(http://www2012.org/
proceedings/proceedings/p41.pdf).

## 10.3 Otimizando a performance

Não existe uma única resposta para quem quer saber como otimizar
a performance de um produto. Existem várias delas, cada uma com
um ponto de vista diferente. Existem nichos de desenvolvimento frontend que são focados somente nesse assunto – e seria pretensão demais tentar explicar tudo isso por aqui. Mas a seguir você encontra alguns pontos citados pelo A List Apart (http://alistapart.com/article/
improving-ux-through-front-end-performance) sobre boas práticas para
otimizaraperformancedeumsite.Nãoéumchecklistexaustivo,maséum
bomcomeço.Emesmoquevocênãosejaumdesenvolvedor,éválidoterem
menteessespontosourepassá-losparaseutime.

---

- Limpe seu HTML. Renomeie elementos não-semânticos no seu HTML. Agrupe elementos pela funcionalidade que oferecem, não pelo conteúdo. Menos IDs no CSS, menos tempo de carregamento. Evite também os excessos de DIVs – isso também facilita a edição do código no futuro.

- Limpe seu CSS. Remova seletores que não estão sendo usados. Em média, essas linhas extras de código aumentam o tempo de carregamento da página (não o peso, repare) em 5,5%.

- Reúse código sempre que possível. Elementos-mestre, includes, padrões de interação aplicados também ao código. Menos HTML e CSS deixa a manutenção mais fácil e reduz levemente o tempo de carregamento.

- Faça menos requisições. Cada vez que seu site faz uma requisição para um serviço (ex.: "mostrar lista de amigos que curtiram este produto"), o tempo de carregamento aumenta consideravelmente. Aliás, em muitos casos, as requisições demoram mais tempo do que todas as imagens existentes na página demoram para serem carregadas. Evite também a requisição da requisição da requisição, que gera aqueles redirects bizarros que mencionamos aqui antes. Não requisite arquivos em todas as páginas se ele não está sendo realmente exibido em todas elas. Quando possível, substitua scripts de redes sociais por links.

- Otimize as imagens. Passe-as por otimizadores como o ImageOptim. Mesmo quando a imagem está em alta resolução para dispositivos com tela-retina, comprima.

- Economize nas requisições de imagens. Crie sprites. Por exemplo: para backgrounds que se repetem, crie uma para repetição horizontal, outra para repetição vertical.

- Use menos imagens. Verifique quais imagens você consegue substituir com efeitos de CSS3. Além de reduzir drasticamente o peso, isso permite que você edite essas imagens no futuro apenas via CSS (para não ter que abrir e editar o asset original). mitem embedar uma imagem no CSS en uma URL que irá carrega-la.

Existem tecnologias que pervez de sempre apontar para

## Como UX e visual designers poo da página?

## em contribuir para a otimização

Além desses pontos mais técnicos (consulte sempre um profissional front-end) existe um último que impacta diretamente na forma em que UX e visual designers podem contribuir para a otimização da performance de uma página – criar um design que seja otimizado para boa performance, desde o primeiro dia do projeto.

Quantos tamanhos de fonte você está usando? Precisas mesmo de todos eles? Lembre-se que cada tamanho de fonte vira uma classe no CSS, e isso aumenta o tempo de carregamento. Quantas imagens você está usando? Você está usando imagens full screen somente quando é realmente necessário? O seu layout "combina" com o tipo de site que você está desenhando? Se você está trabalhando em um e-commerce, onde a performance da página tem impacto direto na conversão e vendas, tem certeza de que aquela imagem $1600 \times 1200$ que você adicionou é realmente necessária? Você está reutilizando elementos da melhor forma possível, ao invés de criar elementos novos na página a cada vez? Todos os blocos de conteúdo que você colocou na página são realmente necessários? Quais deles você poderia sacrificar em benefício de um menor tempo de carregamento? Quais elementos você pode carregar somente depois que o usuário começa a descer a rolagem?

A lista é extensa, o assunto é complexo e as técnicas de otimização mudam a cada dia.

## GOSTA DESSE ASSUNTO?

Se você tem interesse em conhecer mais sobre as questões de performance em design, acesse http://fabricio.nu/performance.

---



---

Capítulo 11

# Produtosqueninguémusa

ProfissionaisquetrabalhamemáreasdiretamenterelacionadasaDesigne
Tecnologia costumam ser fascinados por inovações tecnológicas. Diariamente lemos blogs, portais e outros sites com notícias de tecnologia e ficamos realmente empolgados quando alguma grande empresa lança uma
novatraquitanatecnológica.

Masaspessoasqueutilizarãoosprodutosquecriamos,nemsempre.Aliás,quasenunca. Experimenteperguntarparaoseucabeleireiroouparao
caixadosupermercadoseelesabeoqueéHTML,oqueéoSnapchatouo
quesignificaRealidadeAumentada. Tecnologiasessasquefazempartedo
nossovocabulárioedemaisninguém. Pelomenosnãodovocabuláriodas
“pessoasnormais”,paraasquaisvocêdesenhamuitosprodutosnodecorrer
dasuacarreiracomodesigner.

---

# 11.1 COMEÇANDO PELO USUÁRIO

Um exemplo clássico da fascinação pela tecnologia é o caso dos QR Codes: uma versão bidimensional dos códigos de barras que virou febre nos últimos anos entre algumas empresas. A ideia é interessante: basta o usuário escanear o QR Code usando a câmera do seu smartphone e ele consegue acessar alguma URL "escondida" ali naquele código.

Mas o problema é que os QR Codes nunca foram febre entre os usuários – pesquisas mostram que a massiva maioria das pessoas nunca ouviu falar no termo e sequer possuem um aplicativo que consegue ler QR Codes instalado em seus celulares.

O assunto virou até piada na internet em blogs como o http://wtfqrcodes.com/ e o http://picturesofpeoplescanningqrcodes.tumblr.com/.

Casos como esse, de tecnologias que so fazem sentido para os usuários avançados, mas que não são utilizadas pelos usuários médios, são mais comuns do que parecem. E a origem do problema é uma só: muitas vezes os times começam a criar o produto pensando na tecnologia que será utilizada, em vez de pensarem no problema que ele está tentando solucionar na vida dos usuários.

"Nós vamos criar o primeiro aplicativo de re com Bluetooth no ponto de venda".

lidade aumentada integrado

"Nós vamos criar uma solução de interconectividade entre browser e banco de dados que utiliza protocolos de conexão abertos".

---

"Nós vamos criar um sistema que conecta serviço Y e manda tudo por SMS".

a API do serviço X com o

Convenhamos. Usuários intermediários e iniciantes não pensam assim e nunca pensarão. O que os usuários querem é "uma solução para pagar minha conta de luz no celular". Ou "uma solução para gastar menos tempo na fila do banco".

Steve Jobs tem uma frase muito c bem até hoje:

nhecida sobre o assunto que funciona

"Comece com a experiência do usuário e depois defina a tecnologia usada."

## 11.2 ESCOLHENDO UMA TECNOLOGIA

Idealmente, um produto se inicia a partir de uma necessidade real dos usuários. Existem várias formas de se chegar até uma necessidade: através de pesquisas com consumidores, através de relatórios de tendências produzidos por consultorias parceiras, ou mesmo através de um insight que você teve enquanto estava tentando resolver um problema no seu dia a dia.

Depois de definido o problema que o produto está tentando resolver e de passada uma etapa inicial de conceituação e brainstorms, existe um momento em que o time precisa se reunir para definir qual será a tecnologia (ou a combinação de diferentes tecnologias) que permitirá que o usuário consiga resolver o problema.

É só nessa hora que termos como "SMS", "Bluetooth" ou "HTML" deveriam começar a surgir na mesa. Desenvolvedores e profissionais com background mais técnico podem assumir um papel importante nessa hora: por conhecerem de cabo a rabo as tecnologias disponíveis no mercado, é mais fácil para eles definir quais delas podem ser utilizadas na solução.

Nesse momento, o papel do UX designer é garantir que as tecnologias façam sentido para as pessoas e para o contexto onde o produto será utilizado. Afinal, você não vai querer criar um aplicativo de smartphone para consumidores de classe D e E, que raramente têm acesso a esses dispositivos; ou mesmo criar um site mobile para ser acessado dentro de um shopping center,ondemuitasvezesosinaldeinternetasoperadorasdecelularéfraco
einsuficienteparagarantirumaboaexperiênciadousuário.

Outrocenáriocomuméodeotime **receberumbriefingdoclienteque
jápossuaasoluçãotécnicadefinida.** “Precisamoscriarumsiteresponsivo
paranossamarca”ou“precisamoscriarumaplicativodecelularparanossos
prospects”. Masseráqueaquelaérealmenteamelhorsoluçãotécnicapara
oproblemadamarcaedousuário? Seráqueaspessoasestãodispostasa
baixarumaplicativodamarcasóparaconseguiremconsultaropreçodos
produtos, porexemplo? Oideal, nessescasos, équeotimesereúnapara
discutirseaquelasoluçãoérealmenteamelhoropçãoparaaqueleproduto.
Algunscritériosquepodemserlevadosemcontanahoradedecidirentre
umaououtratecnologiasão:

• **Conteúdoefuncionalidadesdoproduto.** Oqueoprodutoprecisa
fazer? Oumelhor: oqueaspessoasprecisamconseguirfazerusando
aqueleproduto? Quaisasfuncionalidadesessenciaisparaoproduto
existir? Qualamelhorplataformaetecnologiaparacriaraquelafuncionalidade?

• **Expectativasdosusuários.** Oqueousuárioesperaconseguirfazer
comoproduto,eoquevocêestáadicionandodebônusdentrodele?
Comquevelocidadeouqueníveldeesforçoosusuáriosestãodispostosarealizarematarefa? Elesestãofamiliarizadoscomatecnologia
escolhida?Elestêmacessoaela?

• **Tempodedesenvolvimento.** Qualocronogramadedesenvolvimento
paraaquelatecnologiaescolhida? Quaisasoutrasopçõesquepodem
tornarodesenvolvimentomaisbreve?Comoodesenvolvimentopode
serfaseadoparalançarfeaturesoquantoantes–econseguirtestá-las
comusuários?

• **Sistemaslegados.** Comquaisoutrossistemasjáexistentesoproduto
precisasecomunicar?Quaistecnologiassãocompatíveiscomeles?

• **Estratégiadedivulgaçãoeoutrospontosdeentrada.** Comoeem
quaiscanaisoprodutoserádivulgado?Atecnologiaescolhidapermite queosusuáriosquefiquemsabendodoprodutoconsigamutilizá-lode
formarápidaefácil? Emquaisoutroscanaisosusuáriosutilizarãoo
produto?

Asdecisõesdetecnologiapodemsercruciaisparaosucessooufracasso
deumproduto,eénessemomentoqueoUXdesignerdevecontribuircom
inputs estratégicos que possam ajudar o time nessa decisão. Conhecer o
público-alvoeastecnologiasàsquaiseletemacessopodeserumfatordecisivoparainformaradecisãotécnica.

Masvamosdeixaressesexemplosumpoucomaistangíveis.Vejaaseguir
algumasdecisõescomunsquetenhonotadonosprojetosdequeparticipei
nosúltimosanos:

• **Siteresponsivovs.sitededicadoparacadatamanhodetela.** Umadas
decisõesmaiscomunsnahoradecriarumwebsiteépensaremcomo
odesignseadaptaráadiferentesresoluçõesdetela. Afinal,usuários
devemconseguiracessarositeindependentedodispositivoqueestão
usando: smartphones, tablets, laptops, desktops, TVsinterativasetc.
Nessecaso,qualamelhoropçãoparaoprojeto? Criarumúnicosite
comlayoutfluidoqueseadaptaautomaticamenteatodosessestamanhosdetela? Outerumsiteespecíficoparaseracessadoemcelular,
outrositeespecíficoparaseracessadoemdesktopetc.?

• **Aplicativomobilevs. Sitemobile.** Seoprodutoestásendocriado
para que os usuários acessem prioritariamente de um smartphone,
qualamelhorsoluçãotécnicaparaisso? Pediraosusuáriosqueinstalemumaplicativodamarca,oupermitirqueelesacessemumsite
dopróprionavegadordocelular? Existemvantagensedesvantagens
emcadaumdoscasos.Sitesestãosempreatualizados,sãocompatíveis
comváriossistemasoperacionais,sãomaisfacilmenteencontráveispelosbuscadoreseideaisparausuáriosqueestãotendocontatocoma
marcapelaprimeiravez. Poroutrolado,aplicativospodemtermelhorperformance,podemserusadosofflineemalgunscasos,permitem
maisliberdadecriativanainterfaceeajudamacriarfidelidadecomos
usuários.

---

- Conteúdo estático vs. Conteúdo dinâmico. O conteúdo das páginas de um site será atualizado com frequência? A frequência é alta o suficiente para justificar que exista um sistema gerenciador de conteúdo para facilitar a administração e publicação desse conteúdo? Ou as páginas serão atualizadas com baixa frequência?

Esses são só alguns exemplos, mas a lista de decisões técnicas é bastante extensa. As tecnologias de comunicação podem variar de Bluetooth a SMS, passando por radiofrequência e tethering. As linguagens de programação também são inúmeras: HTML, JavaScript, C++, Objective C, PHP, Ruby etc. Os sensores também variam: GPS, acelerômetro, giroscópio, câmera, sensores de presença, impressões digitais, luminosidade.

Para o UX designer, mais importante do que conhecer como as tecnologias funcionam (ou mesmo dominar cada uma delas) é entender como as pessoas interagem com ela e como elas impactam na experiência do usuário – tanto positivamente quanto negativamente. Afinal, isso pode ser um fator decisivo quando uma pessoa está considerando utilizar o seu produto ou o de um concorrente.

## 11.3 DEFININDO A PROPOSIÇÃO DE VALOR DO PRODUTO

A Proposição de valor (ou Value Proposition) é o processo de definição de um produto e o resultado encontrado ao final desse processo.

Independente de você trabalhar em agências de publicidade, estudos, consultorias ou startups, são cada vez mais comuns os briefings que tratam de ajudar determinada marca a criar um produto digital, e não apenas de encontrar formas criativas de comunicá-lo para o público-alvo.

Acontece que o processo de criação de produtos digitais acaba sendo um pouco caótico. Dentro de uma empresa, são diversos os departamentos, áreas e negócios que têm opiniões diferentes sobre o que o produto deve ser, para quem ele deve ser desenhado e, principalmente, quais funcionalidades ele deve conter. Mas o exercício de definir a Proposição de valor do produto pode ajudar bastante nessa etapa.

Alguns pontos que a Proposição de valor ajuda a definir são:

---

• Por que estamos investindo recursos nesse produto? Qual a oportunidade de negócios que a empresa vê em criar esse produto? Quais dados e estatísticas ajudam a comprovar que o produto é financeiramente viável?

- O que é o produto? Quais funcionalidades ele contém? Qual a principal função? Como ele se diferencia dos competidores?

- Para quem ele está sendo criado? Qual o perfil demográfico do usuário?
E mais importante: qual o comportamento ou necessidade que são específicos desse usuário e que conectam diferentes perfis demográficos em um grupo consistente e uniforme?

- Onde e quando o produto se frequência? Em casa, em trân constante ou algo para usar un

á usado? Que horas do dia? Com que ito, no trabalho? É um produto de uso a vez só?

- Como queremos que as pessoas usem o produto? Qual é o objetivo de UX? O que queremos que as pessoas sintam ao utilizar esse produto? Qual sensação queremos causar e qual problema queremos resolver?

E a pergunta final: de tudo isso que você listou enquanto tentava responder a essas perguntas, o que é mais importante?

Responder às perguntas listadas anteriormente é relativamente fácil. Basta uma sessão de brainstorm com os membros do time para que vocês percorram cada uma delas e comecem a listar as características do produto. Se você quer criar um aplicativo de celular para as pessoas combinarem caronas com os amigos, em pouco menos de uma hora é possível gerar uma lista de mais de cinquenta ideias de funcionalidade diferentes para o produto.

Mas definir a proposição de valor é também um processo de afunilamento. Depois de discutir com todos do time sobre o que o produto não é e chegar a uma conclusão sobre o que o produto é, o time precisa se policiar e voltar a olhar para a proposição de valor a cada nova decisão de design, tecnologia ou marketing que precisa ser tomada. Ter um objetivo bem definido para o produto ajuda a evitar que o produto se transforme em outra coisa no decorrer do caminho.

---

Éessencialsaberdecidiroquenãoserádesenhado. Oquevocênãodesenhatambémédesign.

"For ____, the ____ offers [Some identified Market Segment] Product offering

ExistemváriosmodelosdisponíveisonlineparaadefiniçãodaProposição
devalordeumproduto.Algunsdelessãomaisprescritivosetentamorientar
otimeapreencherlacunasnahoradedefiniroqueumprodutofaz;outros
sãomaisabertosedãomaisliberdadeaotime.

Oprincipalriscoemnãodefiniressespontosclaramenteéacabarcom
um“produtoFrankenstein”. Aimpressãoqueasempresastêméquequanto
maisfuncionalidades,maisoprodutoseráútilparaaspessoas. Quequanto
maisabrangenteforopúblico-alvo,maisgenteiráutilizá-lo.Quequantomais
cenáriosdeusoforemmapeados,maiseleestarápresentenavidadaspessoas.

Oquenãoénecessariamenteverdade.

Oquenãofaltamporaísãoprodutoscomtoneladasdefuncionalidades,
masquenãosãousadosporninguém. Aliás, arriscodizerqueesseéum
dosprincipaisproblemasdasmilharesdestartupsquecriamprodutoscom cadavezmaisfrequêncianoBrasileforadele. Essailusãodequeumproduto precisa ser grande para poder ser valioso parece um pouco inocente
demais—comoquandotentamoscozinharalgoeacabamoscolocandotanto
tempero,tantorecheio,tantacobertura,queaequaçãodesaboracabapassandodopontoeficandoenjoativa.

Gerarumalistadeideiasdefuncionalidadesparaumprodutoéumprocessorelativamentefácil(apesardetergrandevalorparaoprojeto).Masdecidirquaisdelasentramequaisdelasnãoentraméumprocessoquepode
tomarsemanas,culhões,eumapitadadepesquisacomusuários.Éumprocessoexaustivo,noqualtodosdotimeprecisamestarenvolvidoseprecisam
discutirporlongashoras.

DopontodevistaespecíficodoUXdesigner,saberidentificarumbriefingqueestáinflacionadodemaisesaberdizernãoparaalgumascoisaséum
dosprincipaisdesafiosdaprofissão—mastambémumdosexercíciosmais
divertidos.

---



---

Capítulo 12

# Priorizandofuncionalidades

Quandovocêestáenvolvidodiretamentenacriaçãoedesenvolvimentodeum
produtodigital,énormalquereradicionarfuncionalidadesaeleparagarantir
queelesejao“maiscompletopossível”.

Masénessahoraquemuitosequívocosconceituaisacontecem.

Écomumquedesenvolvedorespensememprodutosdigitaiscomoum
conjuntodefeaturesquecoexistemefuncionamjuntasparaentregarvalor
aousuáriofinal.Acontecequenemsempretermaisfuncionalidadessignifica
terumprodutomelhor.

## 12.1 O eterno problema do escopo e do prazo

Designersedesenvolvedoresfrequentementeseveememumasituaçãoem
queexistelimitaçãodeprazooudebudget.Oprojetotemumadatadelançamentopré-estipulada,eaindaassimexistemuitacoisaaserfeitaatéqueo produtoestejaprontoparaserlançado. Nessescasos,olharparaosdetalhes
daexperiênciadousuárioquefarãooprodutoterumaboausabilidadeeser
bemvistopelaspessoasqueoutilizamnormalmentesãodespriorizadosna
listadeafazeresdoprojeto.

Vocêjádeveterpassadoporisso. Oprojetoestáaalgumassemanasde
terminareositepossuidezenasdepáginasetemplates, masquandovocê
vaianalisaroresultadofinaldeperto,oquevocêvêsãopáginasmalorganizadas,funcionalidadesquenãoforamtestadasexaustivamenteeproblemas
deusabilidadeemtodososmomentosdofluxo.

Masterumprodutogigantenãoénecessariamenteocaminhomaiscorreto.Aindamaissevocêeseutimequerementregarumprodutodealtaqualidadeparaomercadoeumaótimaexperiênciaparaosseususuários.

Emalgunscasos,épreferívelsacrificaralgumasfuncionalidadeselançar
umprodutomenordoque“fazersóporfazer”ou“adicionarsóporadicionar”.
Quantidadenãoéqualidade,aindamaisemumassuntotãocomplexoecheio
depeculiaridadesquantoaexperiênciadousuário.

*“Gooddesignisaslittledesignaspossible.Less,butbetter–itconcentrateson
essentialaspects.Productsarenotburdenedwithnon-essentials.Backto
purity,backtosimplicity.”*

– O10ºprincípiodobomDesignsegundoDieterRams
(http://en.wikipedia.org/wiki/Dieter_Rams)

Cut Copy Paste
Here is some text.

Figura12.1:Comoassim,lançarumtelefonesemCopyandPaste?

---

VejaoexemplodoiPhoneilustradoaqui.Quandofoilançado,oiPhone
nãotinhaafuncionalidadedeCopyandPaste,aqualmuitosdesignersedesenvolvedoresconsiderariamessenciaisparaolançamentodoproduto. Na
verdade,oiPhonenãotinhanemmetadedasfunçõesquetemhoje.Emesmo
assim,oprodutoeratãofácildeusaretinhaumaexperiênciadeusotãoúnica
ememorável,quefoiumgrandesucesso.

## 12.2 A estratégia dos cupcakes

*"Entregueumcupcake,aoinvésdeumbolocomrecheioecobertura.”*

Essa frase foi usada pela Adaptive Path em um vídeo que fala sobre o
planejamentodeprodutosdigitais.

Vejaovídeo: https://vimeo.com/19738421

Quandosetratadeplanejarfeaturesecriarumcronogramaparaqueelas
sejamlançadasemumproduto,muitasempresasaindatêmumamentalidade
queopessoaldaAdaptivePathchamade“mentalidadedebolo”.

Primeiro,comececomobolo. Depoiscrieorecheio. Nofinal,impressionetodomundoaoadicionarumadeliciosacobertura.

CAKE FILLING ICING cake, then filling, then icing

---

Masoproblemadessetipodementalidadeéqueascoisasacontecemem
sequênciacronológica.Eobolo,porsisó,semorecheioenemacobertura,
podesermuitosecoenãomuitoempolganteparaoconsumidor.

Oqueelespropõe,então,équevocê **comececomumcupcake.**

CUPCAKE CAKE WEDDING CAKE

Apesardemenor,ocupcakeporsisójáébonitoesaborosoosuficiente
paraatrairaspessoasparaconsumi-lo.Depoisqueocupcakeestiverpronto,
aísimvocêpodepensaremconstruirumsegundocupcake,umbolomaior
ouatéumbolosuperdecorado.

Eavantagem,éclaro,équeocupcakelevamuitomenostempo(erecursos)paraficarprontodoqueobolo.

Comosprodutosdigitaisoproblemaésimilar. Àsvezes, asempresas
miramtãoaltonoprodutoquequeremlançar,queoprodutoacabanunca
sendolançado.Oupior:élançadosemocuidadocomosdetalhesquefarão
oprodutorealmentesediferenciardaconcorrênciaequedarãoaosusuários
motivossuficientesparavoltaremautilizá-lo.

---

## 12.3 PRIORIZANDO AS FEATURES DE UM PRODUTO

Na hora de decidir quais funcionalidades são realmente essenciais para que o produto se sustente, UX designers, product owners e desenvolvedores acabam usando diferentes métodos e levando em conta diferentes fatores na equação.

Mas de forma resumida, as features devem ser priorizadas levando em conta as necessidades dos usuários, as necessidades de negócios e as condições técnicas para que elas sejam possíveis. A participação de profissionais de UX nesse processo de priorização de features ajuda a colocar o usuário no centro do processo. Um método comum utilizado por eles é o levantamento de casos de uso do produto. Em linhas gerais:

1) Quais são os casos de uso mais comuns no seu produto?

2) Quais são os players ou participantes envolvidos nesse caso?

3) Para que esses participantes consigam realizar a(s) tarefa(s) descrita(s) nesse caso de uso, quais são as funcionalidades que eles utilizam?

4) Dessa lista de funcionalidades, quais delas são estritamente necessárias para que a ação ocorra?

Ao fazer esse exercício, é possível perceber com mais clareza que, apesar de o produto ser grandioso e ter uma série de funcionalidades, apenas um pequeno grupo delas é responsável por 80% a 90% do uso de um produto – enquanto outras mal chegam a representar 1% dos casos.

---

Extreme Delight
Low Investment
High Customer Satisfaction
Extreme Frustration

UmaformabastanteconhecidadepriorizarusosdecasoefuncionalidadeséochamadoKanoModel–criadonosanos80porNoriakaKano,um
expertemsatisfaçãodosconsumidores.

Essencialmente,éumamatrizformadapordoisvérticesondeasfeatures
sãoposicionadaslevandoemcontaaSatisfaçãodoconsumidoreoEsforço
deexecução.

Apartirdomomentoemquevocêpercorretodaalistadefuncionalidades
doseuprodutoeasposicionanessamatriz, ficamaisfácilvisualizarquais
delasdevemserpriorizadas,dependendodoobjetivodenegóciosdaempresa.

---

Extreme Delight
Excitement Generators
Low Investment
High Performance Payoff
Basic Expectations
Customer Satisfaction
Extreme Frustration

Normalmente,oprimeiropassoécumpriromínimonecessárioparaevitar frustração dos usuários (canto inferior direito da matriz). Já no canto
superioresquerdo,ficamoschamados“quickhits": aspequenasimplementaçõesquenãorequeremgrandeesforçotécnicoetrazemresultadosnotáveis
paraaexperiênciadousuário.

AlémdoKanoModel,existemmuitasoutrasmetodologiasparasepriorizarfuncionalidades,todasdefácilacessonawebparaquemseinteressa
peloassunto.Sãovariaçõesdomesmomodeloquepriorizamoutrosaspectos
quenãoasatisfaçãodoconsumidor.MasjáqueaquioassuntoéUXdesign,
melhorseguircomoKanoModelecolocaroconsumidoremprimeirolugar.

---

## 12.4 UM PRODUTO NUNCA ESTÁ PRONTO

Você já deve ter passado por isso no seu trabalho. Durante as últimas semanas do projeto, o time vira noites e noites para deixar tudo redondinho para o lançamento. Depois de alguns conflitos e possíveis atrasos, finalmente o site é lançado, o time comemora e depois nunca mais toca no assunto. Projeto entregue, site no ar, e tanto faz se as pessoas estão tendo uma boa experiência ou não ao interagirem com o produto final.

Mas a verdade é que nem sempre precisa ser assim. Para determinados tipos de produto, é importante planejar o que vai acontecer com ele depois que a primeira versão for lançada. É claro que se você está desenvolvendo uma landing page para um evento que acontece somente em um dia específico, talvez esse não seja o seu caso. Mas muitas vezes o produto tem uma grande oportunidade de evoluir e, consequentemente, gerar novos negócios para a sua agência/produtora/empresa e uma experiência mais refinada para os usuários.

Lançar um novo site, ou aplicativo, ou interface requer cuidado. Após a publicação, é preciso analisar como as pessoas estão realmente interagindo com ele para conseguir otimizar a experiência do usuário. Muitas vezes, uma funcionalidade que você desenhou e desenvolvue com muito cuidado está sendo subutilizada pelos usuários, ou então eles estão tendo dificuldades em prosseguir no fluxo por um pequeno detalhe de usabilidade que passou batido na hora de entregar o produto final.

Nesse sentido, o UX designer pode ajudar o gerente de projetos a planejar quais serão as etapas de evolução do produto após o lançamento. Existe uma série de métodos para se analisar um produto e propor melhorias nele, e um dos principais é olhar para as métricas, entender como as pessoas estão interagindo com cada seção, página e funcionalidade e depois propor pequenos refinamentos para ajudar as pessoas e a empresa a atingir o objetivo original.

Também é importante que, em determinado momento do projeto, o time chegue a um consenso em relação às métricas de sucesso, ou Key Performance Indicators (KPIs) do produto. Como vocês conseguirão medir se o produto realmente cumpriu as metas preestabelecidas? Qual o plano B (e plano C, e D, em alguns casos) caso a meta não seja atingida? Quais mudanças vocês podem fazer no produto para otimizar sua performance?

---

Depois de um tempo que o produto está no ar, o UX designer pode duplar com um profissional de Análise de Métricas (ou Business Intelligence) para analisar o que está e o que não está funcionando ali. Nesse momento, pequenos ajustes na interface podem fazer uma grande diferença para os negocios - o que ajuda a convencer o cliente a investir umas horas a mais depois que o produto está lançado.

Um outro método interessante nesse momento é o teste de usabilidade. Agora que o produto está funcionando, o UX designer pode organizar algumas sessões de testes onde os usuários são convidados a utilizarem o produto e darem feedback sobre o que gostam e o que não gostam. Novamente: um processo como esse gera insights valiosos para otimizar a performance do produto. Em paralelo a isso, após algum tempo de lançamento, é possível observar os outros canais de serviço ao consumidor que a empresa possui para avaliar como as pessoas estão reagindo ao novo produto.

Um exemplo: em um projeto que lançamos recentemente aqui na agência, redesenhamos completamente o e-commerce da marca em questão. Após um mês do lançamento do novo site, fizemos uma série de entrevistas com os operadores do call-center da marca para entender se os consumidores estavam mencionando dificuldades em utilizar o novo site para resolver um problema. No final das entrevistas, saímos com uma lista de cinco melhorias relativamente simples que precisávamos fazer no site para otimizar a experiência dos usuários. Após essa nova versão, o call-center viu uma queda de 8% no número de telefonemas em relação ao site. Menos custo para a empresa, menos problemas para os usuários.

O mais importante é estar preparado para o lançamento e ter um plano de ação. Muitos produtos hoje em dia são lançados em versões drasticamente simplificadas da versão original, como foram concebidos inicialmente. Mas isso não acontece por falta de prazo ou verba. As empresas (principalmente startups) já perceberam que quanto antes um projeto vai para a rua, maiores as chances de receber feedback dos consumidores, testar e implementar melhorias. A partir daí, é claro, as novas funcionalidades podem ser progressivamente "plugadas" no produto à medida que o produto e a empresa evoluem.

---



---

## Capítulo 13 ChecklistdeUX

UserExperiencenãoéumadisciplinabinária,ondeexisteo“certo”eo“errado”.Paraalgunsusuários,determinadolayoutpodeparecerlindoesimples
deusar,enquantoparaoutrospodeseracoisamaisdifícildomundo. Na
essência,UXDesigntratadeentenderoqueosusuáriospensamecomose
comportamquandoestãotentandorealizaralgumatarefausandoumproduto.

Mas,apesardainexatidãoesubjetividadedaexperiênciadousuário,existemalgumasboaspráticasquepodemserúteisparaosUXdesignerseoutros
membrosdotime.

Listeiaseguirumaespéciede **resumo** detudooquefoifaladonolivroaté
agora. Menoscomo“asrespostascertas”emaiscomoumlembretesobreo
quevocêdeveteremmentequandoestiverprojetandoumaexperiênciapara
asoutraspessoas.

Aexperiênciadousuárioprecisaser...

---

## 13.1 SIMPLES

• Reduzir. É possível retirar algum ainda assim permitir que o usuári lemas?

elemento ou informação da tela e consiga cumprir a tarefa sem prob-

• Revelar. Você está revelando as informações prida que o usuário avança no fluxo? É possível da tela e só exibi-la após alguma ação do usuário

gressivamente, à mesconder alguma parte?

- Padronizar. O visual da tela está consistente? Você está usando o mesmo estilo visual para elementos que possuem funções similares? Você está reaproveitando padrões de interação em diferentes partes do produto?

- Simplificar. As informações estão sendo apresentadas da forma mais simples possível, em pequenas doses? É possível reduzir textos ou ocultar alguns elementos naquele momento específico da experiência?

• Priorizar. É possível esconder ou despriorizar visualmente algumas ações, para que a ação primária receba mais importância? Se existem gatilhos escondidos na tela, eles são “descobríveis” de alguma forma (por acidente, por um tutorial)?

- Adiar. É possível reduzir ou retirar algum campo do formulário? Você está realmente usando todas as informações coletadas? É possivel coletar algum desses dados em um momento futuro do fluxo do usuário?

- Testar. A usabilidade do sistema já foi testada o iste uma solução para os problemas mais comu contram ao interagirem com o produto?

m usuários reais? Ex- as que os usuários en-

- Analisar. O time está usando as métricas existentes (ex.: Google Analytics) da melhor forma possível? Quais são pequenos ajustes que podem ser feitos na interface para otimizar a conversão de usuários?

---

## 13.2 Acionável

• **Direcionar.** Estáclaroparaousuárioaaçãoprincipalqueeledeve
tomarnaquelemomentoounaquelatela?

• **Explicar.** Orótulodaaçãoestáclaroedizaousuáriooquevaiacontecerapóseleclicarouinteragir?Épossíveldeixaraindamaisclaro?

• **Indicar.** Osbotõeselinkstêmaaparênciaapropriadaparaexplicarao
usuárioqueelepodeinteragircomeles?

• **Incentivar.** Ostextosdatelaestãoincentivandoousuárioaseguiradiante?Ousuáriotemacessoàsinformaçõesnecessáriasparacontinuar
semovendopelofluxo,semprecisarfazerdesviosderota?

• **Situar.** O usuário consegue se localizar dentro da estrutura do site
naquelemomento? Estáclaroparaelequaloestadodosistema? Ele
sabeemquepassoestádentrodofluxoequantospassosfaltampara
eleconcluiratarefa?

• **Informar.** Ousuáriotemacessoatodasasinformaçõesnecessárias
paraseguiradiante?

• **Ajudar.** Quandoumamensagemdeerroéexibida,estáclaroparao
usuáriooquecausouoerroeoqueeledevefazerparacorrigi-lo?

• **Continuar.** Osistemaevitacriarruassemsaídaparaousuário?Você
estásugerindoaçõesparaousuárioemcadapassodofluxo?

## 13.3 Inteligente

• **Destacar.** Qualaaçãomaiscomumqueousuáriobuscaquandointeragecomseusite? Épossíveldestacaressaaçãoemdetrimentode
outras? Épossívelcriaratalhosparaasaçõesmaiscomunsemdeterminadatela?

• **Prevenir.** Osistemaprevineerrosantesdeelesacontecerem?Olhando
paraasmétricasdosite: quaisoserrosmaiscomunsqueosusuários cometem?Comoanteciparesseserrosedeixarasinstruçõesmaisclaras
paraqueelesnãoaconteçam?

• **Tolerar.** Osistemaétolerantecomdistraçõeseerrosdousuário? É
possível“perdoar”algunserrosnomeiodocaminho?Ousuárioconseguedesfazeraçõescomfacilidade?

• **Personalizar.** Você está usando as informações que possui sobre o
usuáriodamelhorforma? Comessasinformaçõesquevocêpossui,
comovocêpodefacilitaravidadousuáriooufazeraexperiênciaser
maispersonalizadaparasuasnecessidades?

• **Automatizar.** Épossívelautomatizaralgumprocessoparasimplificaro
níveldeesforçorequeridodousuário?Épossívelutilizaralgumsensor
ououtrafontedeinformaçãoemvezdepedirqueousuáriomanualmenteaadicione?

• **Extrapolar.** Vocêestáaproveitandooutrossentidoscomotatoeaudiçãoparatransmitiramensagemparaousuário?

## 13.4 Agradável

• **Humanizar.** Otomdevozdostextosdainterfaceestáalinhadocoma
personalidadedasuamarca?Sesuamarcafosseumapessoa,comoela
conversariacomosusuários?Qualvocabulárioelausaria?

• **Alinhar.** As imagens utilizadas na interface estão alinhadas com o
brandingdaempresa? **Facilitar.** Otamanhodoselementosdainterfacesãosuficientesparaqueousuáriointerajacomelesemtodosos
dispositivosemqueoprodutoéacessado?Ostextossãolegíveisosuficiente?Hácontrasteehierarquianostamanhosdefonte?

• **Mover.** Asanimaçõesetransiçõesdeinterfaceestãosendousadasda
melhorformaparadarfeedbackaousuáriosobresuasaçõeseparaexpressarapersonalidadedamarca?

---

• **Considerar.** O sistema evita criar desvios de rota na experiência?
Todas as ações que você pede para o usuário são extremamente
necessáriasparaoobjetivoqueeletememmenteaousarseuproduto?

• **Explicar.** Estáclaroparaousuárioporqueosistemaestásolicitando
determinadasinformações?Atrocaéjusta?Ousuáriovêcomclareza
obenefícioemforneceraquelesdados?

• **Agilizar.** Você está usando o tempo do usuário com parcimônia?
Quandoumaaçãotomamuitotempoparaserconcluída,osistemapermitequeelefaçaoutrascoisasnomeiotempo?

• **Surpreender.** O sistema proporciona agradáveis surpresas para os
usuáriosnodecorrerdaexperiência?

## 13.5 Relevante

• **Entregar.** As funcionalidades do produto são realmente as que o
usuárioesperaencontrar? Vocêjátestouoseuprodutocomusuários
reais?

• **Refletir.** Porqueaspessoasusariamoseuprodutoemvezdeumprodutoconcorrente?Porqueelasdeixariamdefazeraquelaatividadedo
jeitoquejáfazem,paracomeçaremafazerusandooseuproduto?

• **Escolher.** As tecnologias escolhidas para sustentar o produto são
compatíveiscomastecnologiasàsquaisosusuáriostêmacesso? Os
usuáriosdominamessastecnologias?Algumadelaspodeestarsetornandoumabarreiraparanovosusuários?

• **Acompanhar.** Olhandoparaasmétricasdoproduto:quaisseçõesou
funcionalidadesestãosendopoucoacessadas? Issoénecessariamente
umproblemaparaosobjetivosdenegóciosdaempresa? Épossível
eliminarfunçõesirrelevantesparaaproposiçãodevalordoproduto?

• **Consultar.** Paraperguntaraosusuários:nofinaldaexperiênciaoprodutoestáentregandooquesepropõeafazer?

---

• **Melhorar.** Vocêestáusandoinformaçõescolhidasdosusuários(qualitativamenteouquantitativamente)parafazermelhoriasnoproduto?
Quaisnovasfuncionalidadeselesesperamver? Comoaperfeiçoaros
principaisfluxos?

---

Capítulo 14

# UXnomundodosnegócios

Nateoriaétudomuitobonito,masenaprática?Aessaalturavocêdeveestar
seperguntandosobreorealimpactodaexperiênciadousuárionosnegócios.
Afinal,todossabemosqueumapráticasóseconsolidacomoprofissãoapartir
domomentoemquecomeçaagerarlucroparaasempresas–tornandoo
modelosustentávelparatodasaspartesenvolvidas.

Aboanotíciaéquecadavezmaisasempresasestãopercebendooimpacto
deUXparaosnegócios,apontodemontaremtimesinteirosdeprofissionais
deUXparaseusprojetos.

Porserumaprofissãoumpoucomaisestratégica,énaturalqueonúmero
deprofissionaisdeUXsejamenordoqueodediretoresdearte,oudesenvolvedores,porexemplo.Paradarumaideia:emumaagênciadepublicidade
digitalbrasileirade200funcionários, onúmerodeUXdesignerscostuma
variarentre3e6.NosEUA,essenúmerovariaentre10e20.Jáemempresas maiores (como Globo.com, Amazon, Google), os departamentos de UX podem chegar a 200, 300 profissionais, muitas vezes divididos entre diferentes subáreas (como Pesquisa, Design de Interação etc.).

Essa movimentação começou a acontecer nos presas maiores começarem a perceber o quanto p abilidade podem afetar diretamente os lucros.

nos 2000, quando as emequenas melhorias de us-

## 14.1 DESIGN = DINHEIRO

Um exemplo clássico é o caso do botão de 300 milhões de dólares da Amazon. Isso mesmo. Um simples ajuste em um botão fez com que as vendas da loja virtual aumentasem em 45%, gerando um faturamento adicional de US$ 300 milhões no primeiro ano depois de implementado. Quem conta a história é Jared Spool, da User Interface Engineering — UIE (http://www.uie.com/articles/three_hund_million_button).

A Amazon resolveu investigar e incrementar o formulário de cadastro pelo qual os consumidores passavam assim que terminavam de adicionar os produtos ao carrinho de compras na loja virtual. Em testes de usabilidade, a equipe de Jared percebeu que o problema não estava na usabilidade dos formulários (que eram relativamente simples de serem preenchidos), mas sim no que o formulário representava para os consumidores.

Os consumidores raramente se lembravam de seu nome de usuário e senha na hora de fazer o login e continuar a compra. Para solucionar o problema, eles simplesmente substituíram o botão de "Cadastro" pelo botão de "Continuar", fazendo com que o login ou registro no site fosse um passo opcional no fluxo de compra. Afinal, os consumidores estão mais preocupados em concluir a compra do que em criar um perfil em um site.

## 14.2 CONVENCENDO O TIME A INVESTIR EM UX

Quem trabalha com UX há vários anos já está acostumado a visualizar o retorno sobre investimento (ROI) que a área traz para os negócios. Pequenos ajustes em fluxos de cadastro podem gerar altas porcentagens de conversão, melhorias em ferramentas de busca dentro do seu site podem aumentar drasticamente o tempo de navegação dos usuários e reduzir as taxas de abandono, emudançasnahomepagedeumsitepodemimpactardiretamentequaissão
aspáginasmaisacessadas.

Masemalgunscasos,obviamente,éprecisoconvenceroutraspessoasa
topareminvestiremUX;ocliente,oseuchefe,ochefedeoperaçõesdaempresae/ouosinvestidores.

Não é uma tarefa fácil. Usar estudos de caso como esse da Amazon
citadoanteriormentepodeajudarbastante.Masemcontextosdiferentessão
necessáriasestratégiasdiferentesdeajudaraoutraparteavisualizarapossibilidadederetornoaoseinvestiremUX.

Internamente,algumasdasprincipaisvantagensdeterumprofissionalde
UXdentrodotimeéagilizaroprocessodedesign,evitarrefaçõesemlayouts
eaindafacilitaracomunicaçãoentreosmembrosdotime.

Externamente,nahoradeprovaraoclientequeeleprecisainvestirem
umprofissionaldeUXnoprojeto,acoisamudadefigura:éprecisoencontrar
formascriativasdeexemplificarcomoosbenefíciosdeterumUXdesigner
notimeimpactadiretamenteosobjetivosdenegóciosdaempresa. Masa
dicaaquiécriarumoudoisexemplospráticosqueestejamdiretamenterelacionadosàprincipalmetadaempresa(porexemplo:otimizarocarrinhode
comprasnocasodeume-commerce).

---



---

# Capítulo 15

# ComocomeçaremUXDesign

Nosúltimosanos,tenhorecebidomuitasmensagensdepessoasquequerem
entrarnaáreadeUXmasnãotêmcertezadequalamelhorformadefazêlo.Foientãoqueresolviconectaralgunspontosparatentarajudarquemestá
começandoagoranomercado.

Estelivro, porexemplo, éumdessespontos. Sevocêchegouatéaqui,
esperoquetenhatidoumpanoramarelevantesobreoqueéUserExperience,
oquefazumUXdesignerequaissãoalgunsdosdilemasmaiscomunsda
profissão.

SevocêgostoudoaperitivoeestáinteressadoemseguirumacarreiradentrodaáreadeUserExperienceDesign,estecapítuloéparavocê.

---

## 15.1 O MERCADO DE UX NO BRASIL

UX Design é uma carreira multidisciplinar, o que acaba trazendo para o mercado uma diversidade muito rica de profissionais, formados em diversas áreas do conhecimento. Jornalistas, bibliotecônomos (e bibliotecários), publicitários, designers, gerentes de projeto – o que conta mesmo é a organização, a capacidade de se colocar no lugar dos usuários e muito, muito bom senso.

Em 2011, a UXPA (User Experience Professionals Association) fez uma pesquisa para levantar o perfil dos arquitetos de informação brasileiros: características demográficas, formação, cargo, salários, job description e interesses. Vale a pena dar uma olhada nos resultados e entender um pouco mais sobre mercado no qual você está pensando em entrar: http://www.slideshare.net/upasaopaulo/perfil-do-profissional-de-ux-no-brasil.

Segundo dados do estudo, feito em 2011, 71% dos profissionais de UX brasileiros estão localizados na região sudeste do país, 46% na cidade de São Paulo. A distribuição de gêneros é equilibrada: 56% são homens e 44% mulheres.

86% dos profissionais brasileiros são graduados e/ou possuem algum tipo de pós-graduação, sendo 41% deles em áreas relacionadas a Artes e Design.

Aqui um dado encorajador para quem está pretendendo entrar no mercado agora: 40% dos participantes do estudo se consideram autodidatas e 37% dizem que "aprenderam UX fazendo". Somente 22% aprenderam UX em alguma sala de aula.

Os salários no Brasil variam muito, principalmente pelo fato de não existir uma regulamentação clara para a área. Segundo a mesma pesquisa da UXPA, um profissional Júnior (cerca de 1 ano de experiência) ganhava um salário mensal médio de R$2.252 em 2011. Para profissionais Plenos (entre 3 e 4 anos de experiência), o salário é de R$ 3.350 e para um Sênior (cerca de 6 anos de experiência), R$ 4.979. Nos cargos mais altos a média salarial ficava entre R$6.500 para supervisores e R$ 8.831 para gerentes em 2011. Mas nos últimos anos esse número aumentou bastante, dado o crescimento da procura por profissionais qualificados no mercado em todo o país.

---

## 15.2 Onde trabalhar

Apesardemaisemaisempresasprocuraremecontrataremprofissionaisde
UX,onúmerodeUXdesignersespalhadospelopaísaindaérelativamente
pequenosecomparadocomdiretoresdearteoudesenvolvedores–entãonão
émuitocomumencontrarumdelesnafiladosupermercadoounapadaria
pertodesuacasa.Masmesmoqueessasletrasmágicas(“UX”)nãoapareçam
nonomedocargodapessoa,issonãoquerdizerqueelanãoestejaprojetando
experiênciasparausuários.Comocitadonoiníciodolivro,umprogramador
aodesenvolverumsitetambémacabaparticipandocomoumUserExperiencedesigner.Afinal,aspessoasusarãoaquelainterfacequeoprogramador
estácriandoeissoteráimpactodiretonaexperiênciadelas.

Ainda que nem todo mundo coloque “UX” no nome do cargo do
Linkedin, o número de profissionais que o fazem ao redor do mundo é
gigante: uma rápida busca pelo termo “UX designer” retornará mais de
800milresultados,segundopesquisarealizadaemsetembrode2012(http:
//designmodo.com/future-user-experience-design). Dizematéque“UX”é
umdostermosquemaiscrescenaredesocial.

SegundoapesquisarealizadapelaUXPAem2011(http://www.slideshare.
net/upasaopaulo/perfil-do-profissional-de-ux-no-brasil) , os lugares mais
comunsparasetrabalharcomUXnoBrasilsão,nessaordem: agênciasde
publicidade,empresas-cliente(ex.: Bradesco,Nike,Fiat),consultorias,portais(ex.:UOL,Globo.com)eprodutorasweb.Outroslugaresdalistaincluem
institutosdepesquisa,governo,agênciasdecomunicaçãoestartups.

## 15.3 Como conseguir um emprego na área

MuitagenteentraemcontatocomigocomentandosobreavontadedemudarparaUXdefinitivamente. Normalmente,essaspessoasjáfazemalgum
trabalhorelacionadoaisso,masestãoprocurandoumempregomaisespecializadonoassunto.

Maséumciclo:vocêsóserácontratadocomoUXdesignerquandotiver
umportfoliocomtrabalhosdeUX.MassevocênuncatrabalhoucomUX,
comoéquevaiconseguirmontarumportfolio?

O caminho mais certeiro é o **estágio:** as empresas normalmente re- querem nenhuma experiência anterior, a responsabilidade é menor e você terá chances de errar, acertar, e aprender no meio do processo. Depois de cerca de um ano você terá experiência suficiente no currículo para conseguir uma contratação.

Se no seu caso o estágio é financeiramente inviável, uma opção é se programar antes (leia-se "juntar dinheiro") para poder ficar alguns meses estagiando antes de ser contratado. Mas se você já trabalha com algo relacionado a Design, é possível que consiga começar direto em um cargo de UX designer / arquiteto de informação júnior. Nesse caso, é importante ser honesto nas entrevistas e deixar claro que você está fazendo a transição entre uma área e outra.

Mas como encontrar essas vagas?

## Mas como encontrar essas vagas?

Uma dica é procurar no Linkedin (ou em blogs e sites especializados no assunto) nomes de empresas que fazem um trabalho legal de User Experience, e passar a acompanhar o setor de vagas de seus sites. Ou então trocar uma ideia com pessoas que já trabalham na área e pedir dicas de quais empresas possuem profissionais de UX em seu quadro de funcionários.

No Facebook, existe um grupo especializado em di você estiver efetivamente buscando uma vaga, recom por la: https://www.facebook.com/groups/uxjobs.

ulgar vagas de UX. Se ndo dar uma passada

Mas será que eu sou qualificado o suficiente?

Como dito no início do livro, os principais requisitos para se tornar um profissional de UX são empatia, bom senso e organização. Empatia, porque é preciso entender (e gostar de investigar) o que as pessoas precisam e querem ver quando estão usando produtos digitais. É preciso conversar com pessoas, é preciso saber fazer as perguntas certas e filtrar os resultados (é aqui que entra o bom senso).

Mas se você nunca entrevistou usuários, não é preciso ter medo. Primeiro, porque é um processo que se aprende com a prática. Conheço profissionais que trabalham com pesquisa há anos e dizem que continuam aprendendo a cada nova sessão de entrevistas ou testes. E segundo, porque não existe certo ou errado; o que existem são formas diferentes de se chegar à mesma resposta.

Organização é outra característica bastante desejável. No dia a dia do trabalho de UX você acabará lidando com grandes quantidades de informação em forma bruta, antes de fazer o exercício de simplificá-la e torná-la digerível para os usuários. É preciso ser organizado para não deixar escapar nenhum detalhe, já que normalmente são os pequenos detalhes que fazer a maior diferença na experiência do usuário –para o bem ou para o mal.

Se você sente que se encaixa nesse perfil, vá em frente. O resto você aprende no meio do caminho, à medida que erra e acerta a cada projeto.

## 15.4 COMO SE CONECTAR COM PROFISSIONAIS DE UX

A grande maioria das vagas não é anunciada em lugares públicos; elas surgem de conhecidos, de contatos profissionais ou amigos de amigos. Converse com profissionais da área. Visite empresas que trabalham com isso e descubra mais do dia a dia de um profissional de UX. Participe de eventos – não apenas pelo conteúdo das palestras, mas pelas conversas que acontecem nos intervalos. Faça contatos e siga esses caras nas redes sociais para aprender um pouco sobre como eles pensam.

Converse também com profissionais de áreas diferentes. Grande parte dos conhecimentos que ajudam um UX designer a ser um bom profissional não é exclusivo de User Experience. Converse com o time de tecnologia, com o time de planejamento, com os decisores de negócios – ou mesmo com amigos seus de outras áreas que já trabalharam com alguém de UX no passado. Como a área de UX transita entre várias outras áreas do conhecimento, essa troca de experiências com profissionais de perfis diferentes do seu é sempre válida.

## Grupos e listas de discussão

Grupos de discussão também podem ser uma ótima fonte para saber o que está sendo falado na área e estabelecer contatos com outros profissionais.

Minhas dicas de grupos:

- No Facebook: https://www.facebook.com/groups/designdeinteracao/

- No Linkedin: https://www.linkedin. com/groups/AI-UX-Arquitetura Informa%C3%A7%C3%A30-User-3209228

- No Google Plus: https://plus.google.com/communities/
113160149077207243924

---

O IAI (Information Architecture Institute) possui uma lista de discussão em português da qual participam grande parte dos profissionais da área. Nessa lista são discutidas referências, estudos de caso, novas tecnologias, processos, metodologia, vagas, eventos e outros assuntos relacionados à profissão, incluindo a organização de animados happy hours e outros encontros regionais entre UX designers e arquitetos de informação. Nesta página é possível se inscrever para receber os e-mails e participar das discussões: http://www.iainstitute.org/.

Há também a lista de discussão internacional do IxDA, com um volume ainda maior de participantes e de discussões, todas realizadas em inglês: http://www.ixda.org/discussion.

## 15.5 COMO SE MANTER ATUALIZADO

Muita gente pergunta sobre "como aprender UX", mas prefiro chamar de "como se manter atualizado sobre UX". Isso porque UX não é algo que se aprende da noite pro dia. Ler blogs do assunto, ler livros, assistir a palestras e ouvir podcasts são boas formas de ir adquirindo conhecimento. Esses conteúdos estão cada vez mais acessíveis, quase sempre gratuitamente e online. Treine o inglês para conseguir absorver novos conteúdos. Na prática, quando você está rodeado por essas informações e continua se atualizando, é natural que durante os projetos você consiga pensar em todos os aspectos da experiência do usuário, sem sofrer ou ter receio de falhar.

---

**Links,sites,blogs,podcastseeventos**

Háalgumtemporeuniemumúnicolinkasprincipaisfontesereferências
noassunto,incluindosites,blogs,links,podcasts,eventoseprofissionaispara
vocêseguir.Recomendoescolheralgunsdelesparacomeçaraincorporaressa
leituranoseudiaadia: http://uxdesign.cc/.

Costumotambémpublicarartigosemportuguêssemanalmenteno http:
//arquiteturadeinformacao.com.Nãoesqueçadedarumapassadaporlá.

---

## LivrosdeUX

Jakob Nielsen
Kara Pernice
Eyetracking Web Usability

Ambient Findability
ONLY

Everything Is Miscellaneous
THE POWER OF THE NEW INTEGRAL UNIVERSE
David Wiesberger

(showing 1-20 of 31)
Steve Krug
DON'T MAKE ME THINK
A Customer Service Approach, with Todd Doe
sharing pictures

Information Architecture
for the World Trade Center

HOMEPAG USABILITY
JASON WIELEN & JARR CUI

Designing Web Interfaces

BEGINNING INTERACTIVES
WILL BURTON

Sketching Use Experiences
getting the design right and the right doe
Bill Buxton

DESIGN PARA A INTERNET

Se você está procurando alguns livros para continuar sua jornada de aprendizado, não deixe de conferir essa lista de livros de
UX no GoodReads: https://www.goodreads.com/group/bookshelf/
43635-user-experience-design.

Tambémselecioneialgunslivrosespecíficossobreusabilidadeem http:
//fabricio.nu/usabilidade.

## Postseartigos

Compilei nesse link uma lista com os principais posts do meu blog
paraquemestáchegandoagoranaprofissão: http://arquiteturadeinformacao.
com/por-onde-comecar-em-ux-design.

## PáginasnoFacebook

ExistetambémumcompiladodepáginasnoFacebookquefalamsobre
UXeArquiteturadeinformação. Bastaassinaralistaparapassarareceber
atualizaçõesdiretonasuapáginainicialdoFacebook: https://www.facebook.
com/lists/10150623977151406.

---

## 15.6 COMO APRENDER A USAR AS FERRAMENTAS

Uma das vantages de UX é que conhecer e dominar as ferramentas não é algo essencial para conseguir um emprego na área. Não existe um padrão em relação à ferramenta utilizada entre as empresas (como é o caso do pacote Photoshop, Illustrator e InDesign para diretores de arte), e normalmente os wireframes e outros entregáveis podem ser criados a partir de qualquer ferra-menta básica de edição de imagens ou apresentações. Conheço profissionais que só usam PowerPoint e Excel e que são UX designers talentosíssimos.

Mas ainda assim se você quiser ir se familiarizando com as ferramentas mais usadas, vale a pena baixar demos e testar, mesmo que seja com um projeto fantasma. Algumas delas são online e gratuitas. Entender como essas ferramentas funcionam e o que é possível fazer com elas é mais importante do que possuir agilidade com elas, ou conhecer todos os atalhos – pelo menos no início da carreira de UX.

Se quiser uma lista completa de ferramentas, recomendo visitar http:// fabricio.nu/ferramentas. A lista é extensa, mas não se preocupe: no dia a dia você vai poder escolher suas favoritas e as que o deixam mais confortáveis. Em UX normalmente não existe restrição, já que o mais importante é o raciocínio por trás do documento do que o formato final dele.

## 15.7 MAS POR QUE TRABALHAR COM UX

Essa é uma pergunta difícil, mas importante. Eu mesmo comecei minha carreira como diretor de arte, mas resolvi fazer a migração para UX já no segundo ou terceiro ano de profissão. No fim do dia eu sentia falta de participar das discussões mais estratégicas a respeito do que estava sendo criado; ir além da camada visual e começar a pensar nas funcionalidades e interações que tornavam as tarefas possíveis.

Veja a seguir um trecho de uma entrevista que fiz com a Elisa Volpato, consultora independente de UX que já trabalha há vários anos na profissão:

---

P

## Entrevista com Elisa Volpato

## Comocomeçouatrabalharnaárea?

Souformadaemjornalismo,masjánomeiodocursopercebiquenão
levavamuitojeito.Quandomeformeiefiqueinaquelacrisede“agoravou
terqueviraradulta”fuifazerumaentrevistadeempregoeouvifalarde
arquiteturadeinformação.Aentrevistanãodeucerto,masfoiapalavrachavedequeeuprecisavaparasairpesquisandoporaí.Acheiumexemplardoursobranco,coloqueiembaixodobraçoefuitrabalharemuma
consultoriaespecializadaemUX.

## PorqueUX?

EudescobriqueUXeraoqueeuqueriafazerporquegostavadeorganizareinvestigar.Gostomuitodeobservarpessoas,defazerentrevistas,
testes,inventartécnicasmalucasepensarnomelhorjeitodeinvestigar
umdeterminadoponto.Éincrívelquandodácertoeagentepensa“Zás!
Táaquiaoportunidade!Éissoqueagentetemquefazer!”

Meempolgaapossibilidadedecriarcoisasquepodemserúteisefazer
adiferença. Ficomuitofelizquandoumserviçofuncionabemegosto
depensarqueotrabalhoqueeufaçopodedeixaroutraspessoasfelizes
também. E,senãodeixar, esperoquepelomenosalguémmedêum
feedbackparaeucomeçarociclotododenovo.

---

Se quiser conferir mais entrevistas com profissionais de UX e entender como eles começaram na área: http://arquiteturadeinformacao.com/
por-que-ux/

---



---

# Capítulo 16

# Ofuturodaexperiênciado usuário

Vocêdeveterreparadoqueamaioriadosexemploscitadosnestelivrotrata
desites,aplicativosdecelularouinterfacesquerodeiamnossodiaadia.

Maseoquevempelafrente?

Comofuncionaaexperiênciadousuárionosrelógiosinteligentes, nos
óculos inteligentes, ou mesmo nos eletrodomésticos inteligentes que estão
começandoasurgir?

Arespostaéqueosprincípios,emsuaessência,sãoosmesmos. Usabilidadeéusabilidade,independentedaplataforma. Boasexperiênciasdeuso
nosacompanhamdesdequenascemos–emobjetosfísicos,emespaçosarquitetônicos,emprodutoseletrônicosedigitais.Eatendênciaéqueissocontinueigual,sejaqualforanovatecnologiadomomento.

---

Mas algumas coisas mudam. A forma como as pessoas interagem no celular, por exemplo, é bem diferente da forma como as pessoas interagem com computadores desktop – e os designers tiveram que reaprender tudo isso com o crescimento do uso de celulares nos últimos anos. O simples fato de que nos computadores desktop você interage com o ponteiro do mouse e nos smartphones você interage com a ponta dos dedos já faz uma diferença enorme na forma como as interfaces precisam ser desenhadas.

A mesma coisa acontecerá com os óculos inteligentes e todos os outros objetos citados anteriormente. Em vez de cliques, as pessoas interagem com piscadas, acenos de cabeça e toques na haste do óculos. Isso muda completamente a forma como as interações são pensadas, mas não muda a essência e os princípios de usabilidade e experiência.

Nos próximos anos, certamente surgirão livros especializados explicando "como desenhar interações para os smartwatches" (substitua pelo nome de qualquer objeto novo que venha a surgir).

Os designers precisarão mais uma vez reaprender as melhores práticas, evitar os erros comuns e adequar sua documentação para essa nova realidade. E na velocidade com a qual a tecnologia se transforma, é esperado que num futuro próximo esses processos de "reinvenção" acontezam em intervalos muito mais curtos de tempo.

Mas, mais importante do que explicar os detalhes de cada uma dessas plataformas, o objetivo deste livro foi apresentar os conceitos básicos de User Experience e despertar o interesse em aprender mais sobre o assunto. Se você tiver interesse em acompanhar mais sobre essas novas plataformas,terei todo o prazer de acompanhá-lo na jornada.

Você pode entrar em contato comigo em: http://fabricio.nu

---

## Capítulo 17

## Bibliografia

SAFFER,Dan. DesigningforInteraction: CreatingSmartApplications
andCleverDevices.NewRidersPublishing,18dejulhode2006.

SAFFER,Dan. Microinteractions:DesigningwithDetails. O’ReillyMedia,10demaiode2013.

COLBORNE,Giles.SimpleandUsableWeb,Mobile,andInteractionDesign.NewRidersPublishing,16desetembrode2010.

Alémdoslivrosacima,duranteotextosãoreferenciadoslinkseartigos
publicadosem http://arquiteturadeinformacao.com.