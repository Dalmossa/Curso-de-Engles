---
name: oop
description: Use ao modelar entidades, value objects ou estratégias com Programação Orientada a Objetos em TypeScript no projeto ITS.
---

# OOP — TypeScript (ITS Platform)

Modelagem de domínio (Learner, Mastery, Lesson, Pack, Item). Para design de interfaces/dependências, use `solid`; para camadas, `clean-architecture`.

## Encapsulamento

- Estado privado, comportamento público; exponha o mínimo necessário.
- Campos truly privados com `#` (em runtime) ou `private` (compile-time):

```ts
export class Theta {
  #valor: number;
  constructor(valor: number) {
    if (valor < -5 || valor > 5) throw new RangeError(`Theta fora do intervalo: ${valor}`);
    this.#valor = valor;
  }
  get valor(): number { return this.#valor; } // sem setter: imutável
}
```

- Nunca exponha campo público mutável de entidade (`mastery.theta = x` quebra o invariante).
- Mutação só por método com semântica de domínio: `learner.registrarSessao()` em vez de `learner.streakDays++`.

## Abstração

- Esconda o detalhe atrás de interface/abstract; o consumidor programa contra o conceito, não a implementação.
- Abstração vazia é ruim: crie interfaces a partir de uso real (extraia depois), não preventivamente.

## Herança (com moderação)

- Use `abstract class` apenas quando houver **contrato real + estado/comportamento compartilhado**.
- Prefira **composição**: `Learner` *tem* `Streak`, não *é um* `Streakable`.
- Herança de entidade de domínio raramente sobrevive a 2 níveis — se precisou de 3 níveis, pare e compose.

## Polimorfismo

- Contrato na interface, comportamento variante na implementação — troca em tempo de execução sem `switch`:

```ts
export interface ExerciseStrategy {
  readonly tipo: TipoExercicio;
  pontuar(resposta: Resposta): Pontuacao;
}
export class MinimalPairStrategy implements ExerciseStrategy { /* ... */ }
export class ListeningStrategy implements ExerciseStrategy { /* ... */ }
// consumo sempre via ExerciseStrategy (ver exemplo completo em `solid` → OCP)
```

## Value Objects vs Entities

| | Value Object | Entity |
|---|---|---|
| Identidade | Pelo **valor** (`CEFRLevel.A1 === CEFRLevel.A1`) | Por **id** (`learner.id`) |
| Mutabilidade | Imutável (preferir) | Mutável por métodos de domínio |
| Exemplos | `CEFRLevel`, `Theta`, `LessonId`, `SkillId` | `Learner`, `Mastery`, `Lesson`, `Pack` |
| Validar | No construtor; inválido = não existe o objeto | Invariantes nos métodos |

```ts
export class LessonId {
  private constructor(public readonly valor: string) {}
  static of(valor: string): LessonId {
    if (!/^[a-z0-9_]+$/.test(valor)) throw new Error(`LessonId inválido: ${valor}`);
    return new LessonId(valor);
  }
}
```

- Em TS, igualdade de VO por `===` só vale com flyweight/factory cache; senão compare `.valor` ou use `equals()`.

## Quando NÃO usar classe

- DTOs e payloads de API = `type`/`interface` puros (sem estado, sem comportamento).
- Funções utilitárias sem estado = módulo de funções, não classe estática.
- TS é multiparadigmático: classe só quando houver estado encapsulado com comportamento.

## Anti-padrões

- **Modelo anêmico**: entidade só de getters/setters + services fazendo toda a regra — mova regra de invariante para dentro da entidade.
- **God object**: entidade que conhece DB, HTTP e regra de negócio — domínio puro, sem import de infra.
- **Getter/setter mecânico** para todo campo: encapsulamento de verdade, não Java por hábito.
