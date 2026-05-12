
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Sites
 * 
 */
export type Sites = $Result.DefaultSelection<Prisma.$SitesPayload>
/**
 * Model Amenities
 * 
 */
export type Amenities = $Result.DefaultSelection<Prisma.$AmenitiesPayload>
/**
 * Model EventsTypes
 * 
 */
export type EventsTypes = $Result.DefaultSelection<Prisma.$EventsTypesPayload>
/**
 * Model Events
 * 
 */
export type Events = $Result.DefaultSelection<Prisma.$EventsPayload>
/**
 * Model Programs
 * 
 */
export type Programs = $Result.DefaultSelection<Prisma.$ProgramsPayload>
/**
 * Model Artists
 * 
 */
export type Artists = $Result.DefaultSelection<Prisma.$ArtistsPayload>
/**
 * Model Quiz
 * 
 */
export type Quiz = $Result.DefaultSelection<Prisma.$QuizPayload>
/**
 * Model QuestionsTypes
 * 
 */
export type QuestionsTypes = $Result.DefaultSelection<Prisma.$QuestionsTypesPayload>
/**
 * Model Questions
 * 
 */
export type Questions = $Result.DefaultSelection<Prisma.$QuestionsPayload>
/**
 * Model Impressions
 * 
 */
export type Impressions = $Result.DefaultSelection<Prisma.$ImpressionsPayload>
/**
 * Model Questions_impressions
 * 
 */
export type Questions_impressions = $Result.DefaultSelection<Prisma.$Questions_impressionsPayload>
/**
 * Model Choices
 * 
 */
export type Choices = $Result.DefaultSelection<Prisma.$ChoicesPayload>
/**
 * Model Answers
 * 
 */
export type Answers = $Result.DefaultSelection<Prisma.$AnswersPayload>
/**
 * Model Users
 * 
 */
export type Users = $Result.DefaultSelection<Prisma.$UsersPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Sites
 * const sites = await prisma.sites.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Sites
   * const sites = await prisma.sites.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.sites`: Exposes CRUD operations for the **Sites** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sites
    * const sites = await prisma.sites.findMany()
    * ```
    */
  get sites(): Prisma.SitesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.amenities`: Exposes CRUD operations for the **Amenities** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Amenities
    * const amenities = await prisma.amenities.findMany()
    * ```
    */
  get amenities(): Prisma.AmenitiesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventsTypes`: Exposes CRUD operations for the **EventsTypes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventsTypes
    * const eventsTypes = await prisma.eventsTypes.findMany()
    * ```
    */
  get eventsTypes(): Prisma.EventsTypesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.events`: Exposes CRUD operations for the **Events** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.events.findMany()
    * ```
    */
  get events(): Prisma.EventsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.programs`: Exposes CRUD operations for the **Programs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Programs
    * const programs = await prisma.programs.findMany()
    * ```
    */
  get programs(): Prisma.ProgramsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.artists`: Exposes CRUD operations for the **Artists** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Artists
    * const artists = await prisma.artists.findMany()
    * ```
    */
  get artists(): Prisma.ArtistsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quiz`: Exposes CRUD operations for the **Quiz** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quizzes
    * const quizzes = await prisma.quiz.findMany()
    * ```
    */
  get quiz(): Prisma.QuizDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questionsTypes`: Exposes CRUD operations for the **QuestionsTypes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuestionsTypes
    * const questionsTypes = await prisma.questionsTypes.findMany()
    * ```
    */
  get questionsTypes(): Prisma.QuestionsTypesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questions`: Exposes CRUD operations for the **Questions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.questions.findMany()
    * ```
    */
  get questions(): Prisma.QuestionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.impressions`: Exposes CRUD operations for the **Impressions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Impressions
    * const impressions = await prisma.impressions.findMany()
    * ```
    */
  get impressions(): Prisma.ImpressionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questions_impressions`: Exposes CRUD operations for the **Questions_impressions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions_impressions
    * const questions_impressions = await prisma.questions_impressions.findMany()
    * ```
    */
  get questions_impressions(): Prisma.Questions_impressionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.choices`: Exposes CRUD operations for the **Choices** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Choices
    * const choices = await prisma.choices.findMany()
    * ```
    */
  get choices(): Prisma.ChoicesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.answers`: Exposes CRUD operations for the **Answers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Answers
    * const answers = await prisma.answers.findMany()
    * ```
    */
  get answers(): Prisma.AnswersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **Users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.UsersDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Sites: 'Sites',
    Amenities: 'Amenities',
    EventsTypes: 'EventsTypes',
    Events: 'Events',
    Programs: 'Programs',
    Artists: 'Artists',
    Quiz: 'Quiz',
    QuestionsTypes: 'QuestionsTypes',
    Questions: 'Questions',
    Impressions: 'Impressions',
    Questions_impressions: 'Questions_impressions',
    Choices: 'Choices',
    Answers: 'Answers',
    Users: 'Users'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "sites" | "amenities" | "eventsTypes" | "events" | "programs" | "artists" | "quiz" | "questionsTypes" | "questions" | "impressions" | "questions_impressions" | "choices" | "answers" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Sites: {
        payload: Prisma.$SitesPayload<ExtArgs>
        fields: Prisma.SitesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SitesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SitesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          findFirst: {
            args: Prisma.SitesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SitesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          findMany: {
            args: Prisma.SitesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>[]
          }
          create: {
            args: Prisma.SitesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          createMany: {
            args: Prisma.SitesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SitesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>[]
          }
          delete: {
            args: Prisma.SitesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          update: {
            args: Prisma.SitesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          deleteMany: {
            args: Prisma.SitesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SitesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SitesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>[]
          }
          upsert: {
            args: Prisma.SitesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SitesPayload>
          }
          aggregate: {
            args: Prisma.SitesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSites>
          }
          groupBy: {
            args: Prisma.SitesGroupByArgs<ExtArgs>
            result: $Utils.Optional<SitesGroupByOutputType>[]
          }
          count: {
            args: Prisma.SitesCountArgs<ExtArgs>
            result: $Utils.Optional<SitesCountAggregateOutputType> | number
          }
        }
      }
      Amenities: {
        payload: Prisma.$AmenitiesPayload<ExtArgs>
        fields: Prisma.AmenitiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmenitiesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmenitiesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          findFirst: {
            args: Prisma.AmenitiesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmenitiesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          findMany: {
            args: Prisma.AmenitiesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>[]
          }
          create: {
            args: Prisma.AmenitiesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          createMany: {
            args: Prisma.AmenitiesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmenitiesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>[]
          }
          delete: {
            args: Prisma.AmenitiesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          update: {
            args: Prisma.AmenitiesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          deleteMany: {
            args: Prisma.AmenitiesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmenitiesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmenitiesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>[]
          }
          upsert: {
            args: Prisma.AmenitiesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmenitiesPayload>
          }
          aggregate: {
            args: Prisma.AmenitiesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmenities>
          }
          groupBy: {
            args: Prisma.AmenitiesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmenitiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmenitiesCountArgs<ExtArgs>
            result: $Utils.Optional<AmenitiesCountAggregateOutputType> | number
          }
        }
      }
      EventsTypes: {
        payload: Prisma.$EventsTypesPayload<ExtArgs>
        fields: Prisma.EventsTypesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventsTypesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventsTypesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          findFirst: {
            args: Prisma.EventsTypesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventsTypesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          findMany: {
            args: Prisma.EventsTypesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>[]
          }
          create: {
            args: Prisma.EventsTypesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          createMany: {
            args: Prisma.EventsTypesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventsTypesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>[]
          }
          delete: {
            args: Prisma.EventsTypesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          update: {
            args: Prisma.EventsTypesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          deleteMany: {
            args: Prisma.EventsTypesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventsTypesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventsTypesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>[]
          }
          upsert: {
            args: Prisma.EventsTypesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsTypesPayload>
          }
          aggregate: {
            args: Prisma.EventsTypesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventsTypes>
          }
          groupBy: {
            args: Prisma.EventsTypesGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventsTypesGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventsTypesCountArgs<ExtArgs>
            result: $Utils.Optional<EventsTypesCountAggregateOutputType> | number
          }
        }
      }
      Events: {
        payload: Prisma.$EventsPayload<ExtArgs>
        fields: Prisma.EventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          findFirst: {
            args: Prisma.EventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          findMany: {
            args: Prisma.EventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          create: {
            args: Prisma.EventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          createMany: {
            args: Prisma.EventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          delete: {
            args: Prisma.EventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          update: {
            args: Prisma.EventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          deleteMany: {
            args: Prisma.EventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>[]
          }
          upsert: {
            args: Prisma.EventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventsPayload>
          }
          aggregate: {
            args: Prisma.EventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvents>
          }
          groupBy: {
            args: Prisma.EventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventsCountArgs<ExtArgs>
            result: $Utils.Optional<EventsCountAggregateOutputType> | number
          }
        }
      }
      Programs: {
        payload: Prisma.$ProgramsPayload<ExtArgs>
        fields: Prisma.ProgramsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          findFirst: {
            args: Prisma.ProgramsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          findMany: {
            args: Prisma.ProgramsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>[]
          }
          create: {
            args: Prisma.ProgramsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          createMany: {
            args: Prisma.ProgramsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgramsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>[]
          }
          delete: {
            args: Prisma.ProgramsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          update: {
            args: Prisma.ProgramsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          deleteMany: {
            args: Prisma.ProgramsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgramsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>[]
          }
          upsert: {
            args: Prisma.ProgramsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramsPayload>
          }
          aggregate: {
            args: Prisma.ProgramsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrograms>
          }
          groupBy: {
            args: Prisma.ProgramsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgramsCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramsCountAggregateOutputType> | number
          }
        }
      }
      Artists: {
        payload: Prisma.$ArtistsPayload<ExtArgs>
        fields: Prisma.ArtistsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArtistsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArtistsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          findFirst: {
            args: Prisma.ArtistsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArtistsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          findMany: {
            args: Prisma.ArtistsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>[]
          }
          create: {
            args: Prisma.ArtistsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          createMany: {
            args: Prisma.ArtistsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArtistsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>[]
          }
          delete: {
            args: Prisma.ArtistsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          update: {
            args: Prisma.ArtistsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          deleteMany: {
            args: Prisma.ArtistsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArtistsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArtistsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>[]
          }
          upsert: {
            args: Prisma.ArtistsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArtistsPayload>
          }
          aggregate: {
            args: Prisma.ArtistsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArtists>
          }
          groupBy: {
            args: Prisma.ArtistsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArtistsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArtistsCountArgs<ExtArgs>
            result: $Utils.Optional<ArtistsCountAggregateOutputType> | number
          }
        }
      }
      Quiz: {
        payload: Prisma.$QuizPayload<ExtArgs>
        fields: Prisma.QuizFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findFirst: {
            args: Prisma.QuizFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findMany: {
            args: Prisma.QuizFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          create: {
            args: Prisma.QuizCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          createMany: {
            args: Prisma.QuizCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          delete: {
            args: Prisma.QuizDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          update: {
            args: Prisma.QuizUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          deleteMany: {
            args: Prisma.QuizDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          upsert: {
            args: Prisma.QuizUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          aggregate: {
            args: Prisma.QuizAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuiz>
          }
          groupBy: {
            args: Prisma.QuizGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizCountArgs<ExtArgs>
            result: $Utils.Optional<QuizCountAggregateOutputType> | number
          }
        }
      }
      QuestionsTypes: {
        payload: Prisma.$QuestionsTypesPayload<ExtArgs>
        fields: Prisma.QuestionsTypesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionsTypesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionsTypesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          findFirst: {
            args: Prisma.QuestionsTypesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionsTypesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          findMany: {
            args: Prisma.QuestionsTypesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>[]
          }
          create: {
            args: Prisma.QuestionsTypesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          createMany: {
            args: Prisma.QuestionsTypesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionsTypesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>[]
          }
          delete: {
            args: Prisma.QuestionsTypesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          update: {
            args: Prisma.QuestionsTypesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          deleteMany: {
            args: Prisma.QuestionsTypesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionsTypesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionsTypesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>[]
          }
          upsert: {
            args: Prisma.QuestionsTypesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsTypesPayload>
          }
          aggregate: {
            args: Prisma.QuestionsTypesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestionsTypes>
          }
          groupBy: {
            args: Prisma.QuestionsTypesGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionsTypesGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionsTypesCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionsTypesCountAggregateOutputType> | number
          }
        }
      }
      Questions: {
        payload: Prisma.$QuestionsPayload<ExtArgs>
        fields: Prisma.QuestionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          findFirst: {
            args: Prisma.QuestionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          findMany: {
            args: Prisma.QuestionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>[]
          }
          create: {
            args: Prisma.QuestionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          createMany: {
            args: Prisma.QuestionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>[]
          }
          delete: {
            args: Prisma.QuestionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          update: {
            args: Prisma.QuestionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          deleteMany: {
            args: Prisma.QuestionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>[]
          }
          upsert: {
            args: Prisma.QuestionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionsPayload>
          }
          aggregate: {
            args: Prisma.QuestionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestions>
          }
          groupBy: {
            args: Prisma.QuestionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionsCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionsCountAggregateOutputType> | number
          }
        }
      }
      Impressions: {
        payload: Prisma.$ImpressionsPayload<ExtArgs>
        fields: Prisma.ImpressionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImpressionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImpressionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          findFirst: {
            args: Prisma.ImpressionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImpressionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          findMany: {
            args: Prisma.ImpressionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>[]
          }
          create: {
            args: Prisma.ImpressionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          createMany: {
            args: Prisma.ImpressionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImpressionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>[]
          }
          delete: {
            args: Prisma.ImpressionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          update: {
            args: Prisma.ImpressionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          deleteMany: {
            args: Prisma.ImpressionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImpressionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImpressionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>[]
          }
          upsert: {
            args: Prisma.ImpressionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImpressionsPayload>
          }
          aggregate: {
            args: Prisma.ImpressionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImpressions>
          }
          groupBy: {
            args: Prisma.ImpressionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImpressionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImpressionsCountArgs<ExtArgs>
            result: $Utils.Optional<ImpressionsCountAggregateOutputType> | number
          }
        }
      }
      Questions_impressions: {
        payload: Prisma.$Questions_impressionsPayload<ExtArgs>
        fields: Prisma.Questions_impressionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Questions_impressionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Questions_impressionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          findFirst: {
            args: Prisma.Questions_impressionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Questions_impressionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          findMany: {
            args: Prisma.Questions_impressionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>[]
          }
          create: {
            args: Prisma.Questions_impressionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          createMany: {
            args: Prisma.Questions_impressionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.Questions_impressionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>[]
          }
          delete: {
            args: Prisma.Questions_impressionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          update: {
            args: Prisma.Questions_impressionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          deleteMany: {
            args: Prisma.Questions_impressionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Questions_impressionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.Questions_impressionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>[]
          }
          upsert: {
            args: Prisma.Questions_impressionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Questions_impressionsPayload>
          }
          aggregate: {
            args: Prisma.Questions_impressionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestions_impressions>
          }
          groupBy: {
            args: Prisma.Questions_impressionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Questions_impressionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.Questions_impressionsCountArgs<ExtArgs>
            result: $Utils.Optional<Questions_impressionsCountAggregateOutputType> | number
          }
        }
      }
      Choices: {
        payload: Prisma.$ChoicesPayload<ExtArgs>
        fields: Prisma.ChoicesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChoicesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChoicesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          findFirst: {
            args: Prisma.ChoicesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChoicesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          findMany: {
            args: Prisma.ChoicesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>[]
          }
          create: {
            args: Prisma.ChoicesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          createMany: {
            args: Prisma.ChoicesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChoicesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>[]
          }
          delete: {
            args: Prisma.ChoicesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          update: {
            args: Prisma.ChoicesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          deleteMany: {
            args: Prisma.ChoicesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChoicesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChoicesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>[]
          }
          upsert: {
            args: Prisma.ChoicesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChoicesPayload>
          }
          aggregate: {
            args: Prisma.ChoicesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChoices>
          }
          groupBy: {
            args: Prisma.ChoicesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChoicesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChoicesCountArgs<ExtArgs>
            result: $Utils.Optional<ChoicesCountAggregateOutputType> | number
          }
        }
      }
      Answers: {
        payload: Prisma.$AnswersPayload<ExtArgs>
        fields: Prisma.AnswersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnswersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnswersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          findFirst: {
            args: Prisma.AnswersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnswersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          findMany: {
            args: Prisma.AnswersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>[]
          }
          create: {
            args: Prisma.AnswersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          createMany: {
            args: Prisma.AnswersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnswersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>[]
          }
          delete: {
            args: Prisma.AnswersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          update: {
            args: Prisma.AnswersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          deleteMany: {
            args: Prisma.AnswersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnswersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnswersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>[]
          }
          upsert: {
            args: Prisma.AnswersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnswersPayload>
          }
          aggregate: {
            args: Prisma.AnswersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnswers>
          }
          groupBy: {
            args: Prisma.AnswersGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnswersGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnswersCountArgs<ExtArgs>
            result: $Utils.Optional<AnswersCountAggregateOutputType> | number
          }
        }
      }
      Users: {
        payload: Prisma.$UsersPayload<ExtArgs>
        fields: Prisma.UsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findFirst: {
            args: Prisma.UsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findMany: {
            args: Prisma.UsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          create: {
            args: Prisma.UsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          createMany: {
            args: Prisma.UsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          delete: {
            args: Prisma.UsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          update: {
            args: Prisma.UsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          deleteMany: {
            args: Prisma.UsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          upsert: {
            args: Prisma.UsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    sites?: SitesOmit
    amenities?: AmenitiesOmit
    eventsTypes?: EventsTypesOmit
    events?: EventsOmit
    programs?: ProgramsOmit
    artists?: ArtistsOmit
    quiz?: QuizOmit
    questionsTypes?: QuestionsTypesOmit
    questions?: QuestionsOmit
    impressions?: ImpressionsOmit
    questions_impressions?: Questions_impressionsOmit
    choices?: ChoicesOmit
    answers?: AnswersOmit
    users?: UsersOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SitesCountOutputType
   */

  export type SitesCountOutputType = {
    amenities: number
    events: number
  }

  export type SitesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    amenities?: boolean | SitesCountOutputTypeCountAmenitiesArgs
    events?: boolean | SitesCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * SitesCountOutputType without action
   */
  export type SitesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SitesCountOutputType
     */
    select?: SitesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SitesCountOutputType without action
   */
  export type SitesCountOutputTypeCountAmenitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmenitiesWhereInput
  }

  /**
   * SitesCountOutputType without action
   */
  export type SitesCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
  }


  /**
   * Count Type EventsTypesCountOutputType
   */

  export type EventsTypesCountOutputType = {
    events: number
  }

  export type EventsTypesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | EventsTypesCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * EventsTypesCountOutputType without action
   */
  export type EventsTypesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypesCountOutputType
     */
    select?: EventsTypesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventsTypesCountOutputType without action
   */
  export type EventsTypesCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
  }


  /**
   * Count Type EventsCountOutputType
   */

  export type EventsCountOutputType = {
    programs: number
    artists: number
    quizzes: number
  }

  export type EventsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | EventsCountOutputTypeCountProgramsArgs
    artists?: boolean | EventsCountOutputTypeCountArtistsArgs
    quizzes?: boolean | EventsCountOutputTypeCountQuizzesArgs
  }

  // Custom InputTypes
  /**
   * EventsCountOutputType without action
   */
  export type EventsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsCountOutputType
     */
    select?: EventsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventsCountOutputType without action
   */
  export type EventsCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramsWhereInput
  }

  /**
   * EventsCountOutputType without action
   */
  export type EventsCountOutputTypeCountArtistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArtistsWhereInput
  }

  /**
   * EventsCountOutputType without action
   */
  export type EventsCountOutputTypeCountQuizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
  }


  /**
   * Count Type QuizCountOutputType
   */

  export type QuizCountOutputType = {
    questions: number
  }

  export type QuizCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuizCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * QuizCountOutputType without action
   */
  export type QuizCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizCountOutputType
     */
    select?: QuizCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuizCountOutputType without action
   */
  export type QuizCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionsWhereInput
  }


  /**
   * Count Type QuestionsTypesCountOutputType
   */

  export type QuestionsTypesCountOutputType = {
    questions: number
  }

  export type QuestionsTypesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuestionsTypesCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * QuestionsTypesCountOutputType without action
   */
  export type QuestionsTypesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypesCountOutputType
     */
    select?: QuestionsTypesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionsTypesCountOutputType without action
   */
  export type QuestionsTypesCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionsWhereInput
  }


  /**
   * Count Type QuestionsCountOutputType
   */

  export type QuestionsCountOutputType = {
    impressions: number
    choices: number
    answers: number
  }

  export type QuestionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    impressions?: boolean | QuestionsCountOutputTypeCountImpressionsArgs
    choices?: boolean | QuestionsCountOutputTypeCountChoicesArgs
    answers?: boolean | QuestionsCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuestionsCountOutputType without action
   */
  export type QuestionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsCountOutputType
     */
    select?: QuestionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionsCountOutputType without action
   */
  export type QuestionsCountOutputTypeCountImpressionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Questions_impressionsWhereInput
  }

  /**
   * QuestionsCountOutputType without action
   */
  export type QuestionsCountOutputTypeCountChoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChoicesWhereInput
  }

  /**
   * QuestionsCountOutputType without action
   */
  export type QuestionsCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnswersWhereInput
  }


  /**
   * Count Type ImpressionsCountOutputType
   */

  export type ImpressionsCountOutputType = {
    questions: number
  }

  export type ImpressionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | ImpressionsCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * ImpressionsCountOutputType without action
   */
  export type ImpressionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImpressionsCountOutputType
     */
    select?: ImpressionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImpressionsCountOutputType without action
   */
  export type ImpressionsCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Questions_impressionsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Sites
   */

  export type AggregateSites = {
    _count: SitesCountAggregateOutputType | null
    _avg: SitesAvgAggregateOutputType | null
    _sum: SitesSumAggregateOutputType | null
    _min: SitesMinAggregateOutputType | null
    _max: SitesMaxAggregateOutputType | null
  }

  export type SitesAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    capacity: number | null
  }

  export type SitesSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    capacity: number | null
  }

  export type SitesMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    type: string | null
    capacity: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SitesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    type: string | null
    capacity: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SitesCountAggregateOutputType = {
    id: number
    name: number
    description: number
    latitude: number
    longitude: number
    type: number
    capacity: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SitesAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    capacity?: true
  }

  export type SitesSumAggregateInputType = {
    latitude?: true
    longitude?: true
    capacity?: true
  }

  export type SitesMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    type?: true
    capacity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SitesMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    type?: true
    capacity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SitesCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    latitude?: true
    longitude?: true
    type?: true
    capacity?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SitesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sites to aggregate.
     */
    where?: SitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sites to fetch.
     */
    orderBy?: SitesOrderByWithRelationInput | SitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sites
    **/
    _count?: true | SitesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SitesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SitesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SitesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SitesMaxAggregateInputType
  }

  export type GetSitesAggregateType<T extends SitesAggregateArgs> = {
        [P in keyof T & keyof AggregateSites]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSites[P]>
      : GetScalarType<T[P], AggregateSites[P]>
  }




  export type SitesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SitesWhereInput
    orderBy?: SitesOrderByWithAggregationInput | SitesOrderByWithAggregationInput[]
    by: SitesScalarFieldEnum[] | SitesScalarFieldEnum
    having?: SitesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SitesCountAggregateInputType | true
    _avg?: SitesAvgAggregateInputType
    _sum?: SitesSumAggregateInputType
    _min?: SitesMinAggregateInputType
    _max?: SitesMaxAggregateInputType
  }

  export type SitesGroupByOutputType = {
    id: string
    name: string
    description: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt: Date
    updatedAt: Date
    _count: SitesCountAggregateOutputType | null
    _avg: SitesAvgAggregateOutputType | null
    _sum: SitesSumAggregateOutputType | null
    _min: SitesMinAggregateOutputType | null
    _max: SitesMaxAggregateOutputType | null
  }

  type GetSitesGroupByPayload<T extends SitesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SitesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SitesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SitesGroupByOutputType[P]>
            : GetScalarType<T[P], SitesGroupByOutputType[P]>
        }
      >
    >


  export type SitesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    type?: boolean
    capacity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    amenities?: boolean | Sites$amenitiesArgs<ExtArgs>
    events?: boolean | Sites$eventsArgs<ExtArgs>
    _count?: boolean | SitesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sites"]>

  export type SitesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    type?: boolean
    capacity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sites"]>

  export type SitesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    type?: boolean
    capacity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sites"]>

  export type SitesSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    latitude?: boolean
    longitude?: boolean
    type?: boolean
    capacity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SitesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "latitude" | "longitude" | "type" | "capacity" | "createdAt" | "updatedAt", ExtArgs["result"]["sites"]>
  export type SitesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    amenities?: boolean | Sites$amenitiesArgs<ExtArgs>
    events?: boolean | Sites$eventsArgs<ExtArgs>
    _count?: boolean | SitesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SitesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SitesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SitesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sites"
    objects: {
      amenities: Prisma.$AmenitiesPayload<ExtArgs>[]
      events: Prisma.$EventsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      latitude: number
      longitude: number
      type: string
      capacity: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sites"]>
    composites: {}
  }

  type SitesGetPayload<S extends boolean | null | undefined | SitesDefaultArgs> = $Result.GetResult<Prisma.$SitesPayload, S>

  type SitesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SitesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SitesCountAggregateInputType | true
    }

  export interface SitesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sites'], meta: { name: 'Sites' } }
    /**
     * Find zero or one Sites that matches the filter.
     * @param {SitesFindUniqueArgs} args - Arguments to find a Sites
     * @example
     * // Get one Sites
     * const sites = await prisma.sites.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SitesFindUniqueArgs>(args: SelectSubset<T, SitesFindUniqueArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sites that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SitesFindUniqueOrThrowArgs} args - Arguments to find a Sites
     * @example
     * // Get one Sites
     * const sites = await prisma.sites.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SitesFindUniqueOrThrowArgs>(args: SelectSubset<T, SitesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesFindFirstArgs} args - Arguments to find a Sites
     * @example
     * // Get one Sites
     * const sites = await prisma.sites.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SitesFindFirstArgs>(args?: SelectSubset<T, SitesFindFirstArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sites that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesFindFirstOrThrowArgs} args - Arguments to find a Sites
     * @example
     * // Get one Sites
     * const sites = await prisma.sites.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SitesFindFirstOrThrowArgs>(args?: SelectSubset<T, SitesFindFirstOrThrowArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sites
     * const sites = await prisma.sites.findMany()
     * 
     * // Get first 10 Sites
     * const sites = await prisma.sites.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sitesWithIdOnly = await prisma.sites.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SitesFindManyArgs>(args?: SelectSubset<T, SitesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sites.
     * @param {SitesCreateArgs} args - Arguments to create a Sites.
     * @example
     * // Create one Sites
     * const Sites = await prisma.sites.create({
     *   data: {
     *     // ... data to create a Sites
     *   }
     * })
     * 
     */
    create<T extends SitesCreateArgs>(args: SelectSubset<T, SitesCreateArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sites.
     * @param {SitesCreateManyArgs} args - Arguments to create many Sites.
     * @example
     * // Create many Sites
     * const sites = await prisma.sites.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SitesCreateManyArgs>(args?: SelectSubset<T, SitesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sites and returns the data saved in the database.
     * @param {SitesCreateManyAndReturnArgs} args - Arguments to create many Sites.
     * @example
     * // Create many Sites
     * const sites = await prisma.sites.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sites and only return the `id`
     * const sitesWithIdOnly = await prisma.sites.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SitesCreateManyAndReturnArgs>(args?: SelectSubset<T, SitesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sites.
     * @param {SitesDeleteArgs} args - Arguments to delete one Sites.
     * @example
     * // Delete one Sites
     * const Sites = await prisma.sites.delete({
     *   where: {
     *     // ... filter to delete one Sites
     *   }
     * })
     * 
     */
    delete<T extends SitesDeleteArgs>(args: SelectSubset<T, SitesDeleteArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sites.
     * @param {SitesUpdateArgs} args - Arguments to update one Sites.
     * @example
     * // Update one Sites
     * const sites = await prisma.sites.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SitesUpdateArgs>(args: SelectSubset<T, SitesUpdateArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sites.
     * @param {SitesDeleteManyArgs} args - Arguments to filter Sites to delete.
     * @example
     * // Delete a few Sites
     * const { count } = await prisma.sites.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SitesDeleteManyArgs>(args?: SelectSubset<T, SitesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sites
     * const sites = await prisma.sites.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SitesUpdateManyArgs>(args: SelectSubset<T, SitesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sites and returns the data updated in the database.
     * @param {SitesUpdateManyAndReturnArgs} args - Arguments to update many Sites.
     * @example
     * // Update many Sites
     * const sites = await prisma.sites.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sites and only return the `id`
     * const sitesWithIdOnly = await prisma.sites.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SitesUpdateManyAndReturnArgs>(args: SelectSubset<T, SitesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sites.
     * @param {SitesUpsertArgs} args - Arguments to update or create a Sites.
     * @example
     * // Update or create a Sites
     * const sites = await prisma.sites.upsert({
     *   create: {
     *     // ... data to create a Sites
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sites we want to update
     *   }
     * })
     */
    upsert<T extends SitesUpsertArgs>(args: SelectSubset<T, SitesUpsertArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesCountArgs} args - Arguments to filter Sites to count.
     * @example
     * // Count the number of Sites
     * const count = await prisma.sites.count({
     *   where: {
     *     // ... the filter for the Sites we want to count
     *   }
     * })
    **/
    count<T extends SitesCountArgs>(
      args?: Subset<T, SitesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SitesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SitesAggregateArgs>(args: Subset<T, SitesAggregateArgs>): Prisma.PrismaPromise<GetSitesAggregateType<T>>

    /**
     * Group by Sites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SitesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SitesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SitesGroupByArgs['orderBy'] }
        : { orderBy?: SitesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SitesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSitesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sites model
   */
  readonly fields: SitesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sites.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SitesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    amenities<T extends Sites$amenitiesArgs<ExtArgs> = {}>(args?: Subset<T, Sites$amenitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Sites$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Sites$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sites model
   */
  interface SitesFieldRefs {
    readonly id: FieldRef<"Sites", 'String'>
    readonly name: FieldRef<"Sites", 'String'>
    readonly description: FieldRef<"Sites", 'String'>
    readonly latitude: FieldRef<"Sites", 'Float'>
    readonly longitude: FieldRef<"Sites", 'Float'>
    readonly type: FieldRef<"Sites", 'String'>
    readonly capacity: FieldRef<"Sites", 'Int'>
    readonly createdAt: FieldRef<"Sites", 'DateTime'>
    readonly updatedAt: FieldRef<"Sites", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sites findUnique
   */
  export type SitesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter, which Sites to fetch.
     */
    where: SitesWhereUniqueInput
  }

  /**
   * Sites findUniqueOrThrow
   */
  export type SitesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter, which Sites to fetch.
     */
    where: SitesWhereUniqueInput
  }

  /**
   * Sites findFirst
   */
  export type SitesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter, which Sites to fetch.
     */
    where?: SitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sites to fetch.
     */
    orderBy?: SitesOrderByWithRelationInput | SitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sites.
     */
    cursor?: SitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sites.
     */
    distinct?: SitesScalarFieldEnum | SitesScalarFieldEnum[]
  }

  /**
   * Sites findFirstOrThrow
   */
  export type SitesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter, which Sites to fetch.
     */
    where?: SitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sites to fetch.
     */
    orderBy?: SitesOrderByWithRelationInput | SitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sites.
     */
    cursor?: SitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sites.
     */
    distinct?: SitesScalarFieldEnum | SitesScalarFieldEnum[]
  }

  /**
   * Sites findMany
   */
  export type SitesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter, which Sites to fetch.
     */
    where?: SitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sites to fetch.
     */
    orderBy?: SitesOrderByWithRelationInput | SitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sites.
     */
    cursor?: SitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sites.
     */
    skip?: number
    distinct?: SitesScalarFieldEnum | SitesScalarFieldEnum[]
  }

  /**
   * Sites create
   */
  export type SitesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * The data needed to create a Sites.
     */
    data: XOR<SitesCreateInput, SitesUncheckedCreateInput>
  }

  /**
   * Sites createMany
   */
  export type SitesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sites.
     */
    data: SitesCreateManyInput | SitesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sites createManyAndReturn
   */
  export type SitesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * The data used to create many Sites.
     */
    data: SitesCreateManyInput | SitesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sites update
   */
  export type SitesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * The data needed to update a Sites.
     */
    data: XOR<SitesUpdateInput, SitesUncheckedUpdateInput>
    /**
     * Choose, which Sites to update.
     */
    where: SitesWhereUniqueInput
  }

  /**
   * Sites updateMany
   */
  export type SitesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sites.
     */
    data: XOR<SitesUpdateManyMutationInput, SitesUncheckedUpdateManyInput>
    /**
     * Filter which Sites to update
     */
    where?: SitesWhereInput
    /**
     * Limit how many Sites to update.
     */
    limit?: number
  }

  /**
   * Sites updateManyAndReturn
   */
  export type SitesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * The data used to update Sites.
     */
    data: XOR<SitesUpdateManyMutationInput, SitesUncheckedUpdateManyInput>
    /**
     * Filter which Sites to update
     */
    where?: SitesWhereInput
    /**
     * Limit how many Sites to update.
     */
    limit?: number
  }

  /**
   * Sites upsert
   */
  export type SitesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * The filter to search for the Sites to update in case it exists.
     */
    where: SitesWhereUniqueInput
    /**
     * In case the Sites found by the `where` argument doesn't exist, create a new Sites with this data.
     */
    create: XOR<SitesCreateInput, SitesUncheckedCreateInput>
    /**
     * In case the Sites was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SitesUpdateInput, SitesUncheckedUpdateInput>
  }

  /**
   * Sites delete
   */
  export type SitesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
    /**
     * Filter which Sites to delete.
     */
    where: SitesWhereUniqueInput
  }

  /**
   * Sites deleteMany
   */
  export type SitesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sites to delete
     */
    where?: SitesWhereInput
    /**
     * Limit how many Sites to delete.
     */
    limit?: number
  }

  /**
   * Sites.amenities
   */
  export type Sites$amenitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    where?: AmenitiesWhereInput
    orderBy?: AmenitiesOrderByWithRelationInput | AmenitiesOrderByWithRelationInput[]
    cursor?: AmenitiesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AmenitiesScalarFieldEnum | AmenitiesScalarFieldEnum[]
  }

  /**
   * Sites.events
   */
  export type Sites$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    cursor?: EventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Sites without action
   */
  export type SitesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sites
     */
    select?: SitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sites
     */
    omit?: SitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SitesInclude<ExtArgs> | null
  }


  /**
   * Model Amenities
   */

  export type AggregateAmenities = {
    _count: AmenitiesCountAggregateOutputType | null
    _min: AmenitiesMinAggregateOutputType | null
    _max: AmenitiesMaxAggregateOutputType | null
  }

  export type AmenitiesMinAggregateOutputType = {
    id: string | null
    name: string | null
    siteId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmenitiesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    siteId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmenitiesCountAggregateOutputType = {
    id: number
    name: number
    siteId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmenitiesMinAggregateInputType = {
    id?: true
    name?: true
    siteId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmenitiesMaxAggregateInputType = {
    id?: true
    name?: true
    siteId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmenitiesCountAggregateInputType = {
    id?: true
    name?: true
    siteId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmenitiesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Amenities to aggregate.
     */
    where?: AmenitiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenitiesOrderByWithRelationInput | AmenitiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmenitiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Amenities
    **/
    _count?: true | AmenitiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmenitiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmenitiesMaxAggregateInputType
  }

  export type GetAmenitiesAggregateType<T extends AmenitiesAggregateArgs> = {
        [P in keyof T & keyof AggregateAmenities]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmenities[P]>
      : GetScalarType<T[P], AggregateAmenities[P]>
  }




  export type AmenitiesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmenitiesWhereInput
    orderBy?: AmenitiesOrderByWithAggregationInput | AmenitiesOrderByWithAggregationInput[]
    by: AmenitiesScalarFieldEnum[] | AmenitiesScalarFieldEnum
    having?: AmenitiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmenitiesCountAggregateInputType | true
    _min?: AmenitiesMinAggregateInputType
    _max?: AmenitiesMaxAggregateInputType
  }

  export type AmenitiesGroupByOutputType = {
    id: string
    name: string
    siteId: string
    createdAt: Date
    updatedAt: Date
    _count: AmenitiesCountAggregateOutputType | null
    _min: AmenitiesMinAggregateOutputType | null
    _max: AmenitiesMaxAggregateOutputType | null
  }

  type GetAmenitiesGroupByPayload<T extends AmenitiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmenitiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmenitiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmenitiesGroupByOutputType[P]>
            : GetScalarType<T[P], AmenitiesGroupByOutputType[P]>
        }
      >
    >


  export type AmenitiesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    siteId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["amenities"]>

  export type AmenitiesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    siteId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["amenities"]>

  export type AmenitiesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    siteId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["amenities"]>

  export type AmenitiesSelectScalar = {
    id?: boolean
    name?: boolean
    siteId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmenitiesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "siteId" | "createdAt" | "updatedAt", ExtArgs["result"]["amenities"]>
  export type AmenitiesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }
  export type AmenitiesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }
  export type AmenitiesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
  }

  export type $AmenitiesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Amenities"
    objects: {
      site: Prisma.$SitesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      siteId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["amenities"]>
    composites: {}
  }

  type AmenitiesGetPayload<S extends boolean | null | undefined | AmenitiesDefaultArgs> = $Result.GetResult<Prisma.$AmenitiesPayload, S>

  type AmenitiesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmenitiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmenitiesCountAggregateInputType | true
    }

  export interface AmenitiesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Amenities'], meta: { name: 'Amenities' } }
    /**
     * Find zero or one Amenities that matches the filter.
     * @param {AmenitiesFindUniqueArgs} args - Arguments to find a Amenities
     * @example
     * // Get one Amenities
     * const amenities = await prisma.amenities.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmenitiesFindUniqueArgs>(args: SelectSubset<T, AmenitiesFindUniqueArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Amenities that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmenitiesFindUniqueOrThrowArgs} args - Arguments to find a Amenities
     * @example
     * // Get one Amenities
     * const amenities = await prisma.amenities.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmenitiesFindUniqueOrThrowArgs>(args: SelectSubset<T, AmenitiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Amenities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesFindFirstArgs} args - Arguments to find a Amenities
     * @example
     * // Get one Amenities
     * const amenities = await prisma.amenities.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmenitiesFindFirstArgs>(args?: SelectSubset<T, AmenitiesFindFirstArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Amenities that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesFindFirstOrThrowArgs} args - Arguments to find a Amenities
     * @example
     * // Get one Amenities
     * const amenities = await prisma.amenities.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmenitiesFindFirstOrThrowArgs>(args?: SelectSubset<T, AmenitiesFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Amenities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Amenities
     * const amenities = await prisma.amenities.findMany()
     * 
     * // Get first 10 Amenities
     * const amenities = await prisma.amenities.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const amenitiesWithIdOnly = await prisma.amenities.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmenitiesFindManyArgs>(args?: SelectSubset<T, AmenitiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Amenities.
     * @param {AmenitiesCreateArgs} args - Arguments to create a Amenities.
     * @example
     * // Create one Amenities
     * const Amenities = await prisma.amenities.create({
     *   data: {
     *     // ... data to create a Amenities
     *   }
     * })
     * 
     */
    create<T extends AmenitiesCreateArgs>(args: SelectSubset<T, AmenitiesCreateArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Amenities.
     * @param {AmenitiesCreateManyArgs} args - Arguments to create many Amenities.
     * @example
     * // Create many Amenities
     * const amenities = await prisma.amenities.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmenitiesCreateManyArgs>(args?: SelectSubset<T, AmenitiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Amenities and returns the data saved in the database.
     * @param {AmenitiesCreateManyAndReturnArgs} args - Arguments to create many Amenities.
     * @example
     * // Create many Amenities
     * const amenities = await prisma.amenities.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Amenities and only return the `id`
     * const amenitiesWithIdOnly = await prisma.amenities.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmenitiesCreateManyAndReturnArgs>(args?: SelectSubset<T, AmenitiesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Amenities.
     * @param {AmenitiesDeleteArgs} args - Arguments to delete one Amenities.
     * @example
     * // Delete one Amenities
     * const Amenities = await prisma.amenities.delete({
     *   where: {
     *     // ... filter to delete one Amenities
     *   }
     * })
     * 
     */
    delete<T extends AmenitiesDeleteArgs>(args: SelectSubset<T, AmenitiesDeleteArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Amenities.
     * @param {AmenitiesUpdateArgs} args - Arguments to update one Amenities.
     * @example
     * // Update one Amenities
     * const amenities = await prisma.amenities.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmenitiesUpdateArgs>(args: SelectSubset<T, AmenitiesUpdateArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Amenities.
     * @param {AmenitiesDeleteManyArgs} args - Arguments to filter Amenities to delete.
     * @example
     * // Delete a few Amenities
     * const { count } = await prisma.amenities.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmenitiesDeleteManyArgs>(args?: SelectSubset<T, AmenitiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Amenities
     * const amenities = await prisma.amenities.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmenitiesUpdateManyArgs>(args: SelectSubset<T, AmenitiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Amenities and returns the data updated in the database.
     * @param {AmenitiesUpdateManyAndReturnArgs} args - Arguments to update many Amenities.
     * @example
     * // Update many Amenities
     * const amenities = await prisma.amenities.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Amenities and only return the `id`
     * const amenitiesWithIdOnly = await prisma.amenities.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmenitiesUpdateManyAndReturnArgs>(args: SelectSubset<T, AmenitiesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Amenities.
     * @param {AmenitiesUpsertArgs} args - Arguments to update or create a Amenities.
     * @example
     * // Update or create a Amenities
     * const amenities = await prisma.amenities.upsert({
     *   create: {
     *     // ... data to create a Amenities
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Amenities we want to update
     *   }
     * })
     */
    upsert<T extends AmenitiesUpsertArgs>(args: SelectSubset<T, AmenitiesUpsertArgs<ExtArgs>>): Prisma__AmenitiesClient<$Result.GetResult<Prisma.$AmenitiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesCountArgs} args - Arguments to filter Amenities to count.
     * @example
     * // Count the number of Amenities
     * const count = await prisma.amenities.count({
     *   where: {
     *     // ... the filter for the Amenities we want to count
     *   }
     * })
    **/
    count<T extends AmenitiesCountArgs>(
      args?: Subset<T, AmenitiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmenitiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmenitiesAggregateArgs>(args: Subset<T, AmenitiesAggregateArgs>): Prisma.PrismaPromise<GetAmenitiesAggregateType<T>>

    /**
     * Group by Amenities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmenitiesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmenitiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmenitiesGroupByArgs['orderBy'] }
        : { orderBy?: AmenitiesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmenitiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmenitiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Amenities model
   */
  readonly fields: AmenitiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Amenities.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmenitiesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    site<T extends SitesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SitesDefaultArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Amenities model
   */
  interface AmenitiesFieldRefs {
    readonly id: FieldRef<"Amenities", 'String'>
    readonly name: FieldRef<"Amenities", 'String'>
    readonly siteId: FieldRef<"Amenities", 'String'>
    readonly createdAt: FieldRef<"Amenities", 'DateTime'>
    readonly updatedAt: FieldRef<"Amenities", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Amenities findUnique
   */
  export type AmenitiesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where: AmenitiesWhereUniqueInput
  }

  /**
   * Amenities findUniqueOrThrow
   */
  export type AmenitiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where: AmenitiesWhereUniqueInput
  }

  /**
   * Amenities findFirst
   */
  export type AmenitiesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where?: AmenitiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenitiesOrderByWithRelationInput | AmenitiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Amenities.
     */
    cursor?: AmenitiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Amenities.
     */
    distinct?: AmenitiesScalarFieldEnum | AmenitiesScalarFieldEnum[]
  }

  /**
   * Amenities findFirstOrThrow
   */
  export type AmenitiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where?: AmenitiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenitiesOrderByWithRelationInput | AmenitiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Amenities.
     */
    cursor?: AmenitiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Amenities.
     */
    distinct?: AmenitiesScalarFieldEnum | AmenitiesScalarFieldEnum[]
  }

  /**
   * Amenities findMany
   */
  export type AmenitiesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter, which Amenities to fetch.
     */
    where?: AmenitiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Amenities to fetch.
     */
    orderBy?: AmenitiesOrderByWithRelationInput | AmenitiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Amenities.
     */
    cursor?: AmenitiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Amenities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Amenities.
     */
    skip?: number
    distinct?: AmenitiesScalarFieldEnum | AmenitiesScalarFieldEnum[]
  }

  /**
   * Amenities create
   */
  export type AmenitiesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * The data needed to create a Amenities.
     */
    data: XOR<AmenitiesCreateInput, AmenitiesUncheckedCreateInput>
  }

  /**
   * Amenities createMany
   */
  export type AmenitiesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Amenities.
     */
    data: AmenitiesCreateManyInput | AmenitiesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Amenities createManyAndReturn
   */
  export type AmenitiesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * The data used to create many Amenities.
     */
    data: AmenitiesCreateManyInput | AmenitiesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Amenities update
   */
  export type AmenitiesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * The data needed to update a Amenities.
     */
    data: XOR<AmenitiesUpdateInput, AmenitiesUncheckedUpdateInput>
    /**
     * Choose, which Amenities to update.
     */
    where: AmenitiesWhereUniqueInput
  }

  /**
   * Amenities updateMany
   */
  export type AmenitiesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Amenities.
     */
    data: XOR<AmenitiesUpdateManyMutationInput, AmenitiesUncheckedUpdateManyInput>
    /**
     * Filter which Amenities to update
     */
    where?: AmenitiesWhereInput
    /**
     * Limit how many Amenities to update.
     */
    limit?: number
  }

  /**
   * Amenities updateManyAndReturn
   */
  export type AmenitiesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * The data used to update Amenities.
     */
    data: XOR<AmenitiesUpdateManyMutationInput, AmenitiesUncheckedUpdateManyInput>
    /**
     * Filter which Amenities to update
     */
    where?: AmenitiesWhereInput
    /**
     * Limit how many Amenities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Amenities upsert
   */
  export type AmenitiesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * The filter to search for the Amenities to update in case it exists.
     */
    where: AmenitiesWhereUniqueInput
    /**
     * In case the Amenities found by the `where` argument doesn't exist, create a new Amenities with this data.
     */
    create: XOR<AmenitiesCreateInput, AmenitiesUncheckedCreateInput>
    /**
     * In case the Amenities was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmenitiesUpdateInput, AmenitiesUncheckedUpdateInput>
  }

  /**
   * Amenities delete
   */
  export type AmenitiesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
    /**
     * Filter which Amenities to delete.
     */
    where: AmenitiesWhereUniqueInput
  }

  /**
   * Amenities deleteMany
   */
  export type AmenitiesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Amenities to delete
     */
    where?: AmenitiesWhereInput
    /**
     * Limit how many Amenities to delete.
     */
    limit?: number
  }

  /**
   * Amenities without action
   */
  export type AmenitiesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Amenities
     */
    select?: AmenitiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Amenities
     */
    omit?: AmenitiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AmenitiesInclude<ExtArgs> | null
  }


  /**
   * Model EventsTypes
   */

  export type AggregateEventsTypes = {
    _count: EventsTypesCountAggregateOutputType | null
    _min: EventsTypesMinAggregateOutputType | null
    _max: EventsTypesMaxAggregateOutputType | null
  }

  export type EventsTypesMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventsTypesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventsTypesCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventsTypesMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventsTypesMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventsTypesCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventsTypesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventsTypes to aggregate.
     */
    where?: EventsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventsTypes to fetch.
     */
    orderBy?: EventsTypesOrderByWithRelationInput | EventsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventsTypes
    **/
    _count?: true | EventsTypesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventsTypesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventsTypesMaxAggregateInputType
  }

  export type GetEventsTypesAggregateType<T extends EventsTypesAggregateArgs> = {
        [P in keyof T & keyof AggregateEventsTypes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventsTypes[P]>
      : GetScalarType<T[P], AggregateEventsTypes[P]>
  }




  export type EventsTypesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsTypesWhereInput
    orderBy?: EventsTypesOrderByWithAggregationInput | EventsTypesOrderByWithAggregationInput[]
    by: EventsTypesScalarFieldEnum[] | EventsTypesScalarFieldEnum
    having?: EventsTypesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventsTypesCountAggregateInputType | true
    _min?: EventsTypesMinAggregateInputType
    _max?: EventsTypesMaxAggregateInputType
  }

  export type EventsTypesGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: EventsTypesCountAggregateOutputType | null
    _min: EventsTypesMinAggregateOutputType | null
    _max: EventsTypesMaxAggregateOutputType | null
  }

  type GetEventsTypesGroupByPayload<T extends EventsTypesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventsTypesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventsTypesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventsTypesGroupByOutputType[P]>
            : GetScalarType<T[P], EventsTypesGroupByOutputType[P]>
        }
      >
    >


  export type EventsTypesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    events?: boolean | EventsTypes$eventsArgs<ExtArgs>
    _count?: boolean | EventsTypesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventsTypes"]>

  export type EventsTypesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["eventsTypes"]>

  export type EventsTypesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["eventsTypes"]>

  export type EventsTypesSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventsTypesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["eventsTypes"]>
  export type EventsTypesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | EventsTypes$eventsArgs<ExtArgs>
    _count?: boolean | EventsTypesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventsTypesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EventsTypesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EventsTypesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventsTypes"
    objects: {
      events: Prisma.$EventsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["eventsTypes"]>
    composites: {}
  }

  type EventsTypesGetPayload<S extends boolean | null | undefined | EventsTypesDefaultArgs> = $Result.GetResult<Prisma.$EventsTypesPayload, S>

  type EventsTypesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventsTypesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventsTypesCountAggregateInputType | true
    }

  export interface EventsTypesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventsTypes'], meta: { name: 'EventsTypes' } }
    /**
     * Find zero or one EventsTypes that matches the filter.
     * @param {EventsTypesFindUniqueArgs} args - Arguments to find a EventsTypes
     * @example
     * // Get one EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventsTypesFindUniqueArgs>(args: SelectSubset<T, EventsTypesFindUniqueArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventsTypes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventsTypesFindUniqueOrThrowArgs} args - Arguments to find a EventsTypes
     * @example
     * // Get one EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventsTypesFindUniqueOrThrowArgs>(args: SelectSubset<T, EventsTypesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesFindFirstArgs} args - Arguments to find a EventsTypes
     * @example
     * // Get one EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventsTypesFindFirstArgs>(args?: SelectSubset<T, EventsTypesFindFirstArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventsTypes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesFindFirstOrThrowArgs} args - Arguments to find a EventsTypes
     * @example
     * // Get one EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventsTypesFindFirstOrThrowArgs>(args?: SelectSubset<T, EventsTypesFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findMany()
     * 
     * // Get first 10 EventsTypes
     * const eventsTypes = await prisma.eventsTypes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventsTypesWithIdOnly = await prisma.eventsTypes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventsTypesFindManyArgs>(args?: SelectSubset<T, EventsTypesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventsTypes.
     * @param {EventsTypesCreateArgs} args - Arguments to create a EventsTypes.
     * @example
     * // Create one EventsTypes
     * const EventsTypes = await prisma.eventsTypes.create({
     *   data: {
     *     // ... data to create a EventsTypes
     *   }
     * })
     * 
     */
    create<T extends EventsTypesCreateArgs>(args: SelectSubset<T, EventsTypesCreateArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventsTypes.
     * @param {EventsTypesCreateManyArgs} args - Arguments to create many EventsTypes.
     * @example
     * // Create many EventsTypes
     * const eventsTypes = await prisma.eventsTypes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventsTypesCreateManyArgs>(args?: SelectSubset<T, EventsTypesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventsTypes and returns the data saved in the database.
     * @param {EventsTypesCreateManyAndReturnArgs} args - Arguments to create many EventsTypes.
     * @example
     * // Create many EventsTypes
     * const eventsTypes = await prisma.eventsTypes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventsTypes and only return the `id`
     * const eventsTypesWithIdOnly = await prisma.eventsTypes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventsTypesCreateManyAndReturnArgs>(args?: SelectSubset<T, EventsTypesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventsTypes.
     * @param {EventsTypesDeleteArgs} args - Arguments to delete one EventsTypes.
     * @example
     * // Delete one EventsTypes
     * const EventsTypes = await prisma.eventsTypes.delete({
     *   where: {
     *     // ... filter to delete one EventsTypes
     *   }
     * })
     * 
     */
    delete<T extends EventsTypesDeleteArgs>(args: SelectSubset<T, EventsTypesDeleteArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventsTypes.
     * @param {EventsTypesUpdateArgs} args - Arguments to update one EventsTypes.
     * @example
     * // Update one EventsTypes
     * const eventsTypes = await prisma.eventsTypes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventsTypesUpdateArgs>(args: SelectSubset<T, EventsTypesUpdateArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventsTypes.
     * @param {EventsTypesDeleteManyArgs} args - Arguments to filter EventsTypes to delete.
     * @example
     * // Delete a few EventsTypes
     * const { count } = await prisma.eventsTypes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventsTypesDeleteManyArgs>(args?: SelectSubset<T, EventsTypesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventsTypes
     * const eventsTypes = await prisma.eventsTypes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventsTypesUpdateManyArgs>(args: SelectSubset<T, EventsTypesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventsTypes and returns the data updated in the database.
     * @param {EventsTypesUpdateManyAndReturnArgs} args - Arguments to update many EventsTypes.
     * @example
     * // Update many EventsTypes
     * const eventsTypes = await prisma.eventsTypes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventsTypes and only return the `id`
     * const eventsTypesWithIdOnly = await prisma.eventsTypes.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventsTypesUpdateManyAndReturnArgs>(args: SelectSubset<T, EventsTypesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventsTypes.
     * @param {EventsTypesUpsertArgs} args - Arguments to update or create a EventsTypes.
     * @example
     * // Update or create a EventsTypes
     * const eventsTypes = await prisma.eventsTypes.upsert({
     *   create: {
     *     // ... data to create a EventsTypes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventsTypes we want to update
     *   }
     * })
     */
    upsert<T extends EventsTypesUpsertArgs>(args: SelectSubset<T, EventsTypesUpsertArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesCountArgs} args - Arguments to filter EventsTypes to count.
     * @example
     * // Count the number of EventsTypes
     * const count = await prisma.eventsTypes.count({
     *   where: {
     *     // ... the filter for the EventsTypes we want to count
     *   }
     * })
    **/
    count<T extends EventsTypesCountArgs>(
      args?: Subset<T, EventsTypesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventsTypesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventsTypesAggregateArgs>(args: Subset<T, EventsTypesAggregateArgs>): Prisma.PrismaPromise<GetEventsTypesAggregateType<T>>

    /**
     * Group by EventsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsTypesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventsTypesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventsTypesGroupByArgs['orderBy'] }
        : { orderBy?: EventsTypesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventsTypesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventsTypesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventsTypes model
   */
  readonly fields: EventsTypesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventsTypes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventsTypesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends EventsTypes$eventsArgs<ExtArgs> = {}>(args?: Subset<T, EventsTypes$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventsTypes model
   */
  interface EventsTypesFieldRefs {
    readonly id: FieldRef<"EventsTypes", 'String'>
    readonly name: FieldRef<"EventsTypes", 'String'>
    readonly createdAt: FieldRef<"EventsTypes", 'DateTime'>
    readonly updatedAt: FieldRef<"EventsTypes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventsTypes findUnique
   */
  export type EventsTypesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter, which EventsTypes to fetch.
     */
    where: EventsTypesWhereUniqueInput
  }

  /**
   * EventsTypes findUniqueOrThrow
   */
  export type EventsTypesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter, which EventsTypes to fetch.
     */
    where: EventsTypesWhereUniqueInput
  }

  /**
   * EventsTypes findFirst
   */
  export type EventsTypesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter, which EventsTypes to fetch.
     */
    where?: EventsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventsTypes to fetch.
     */
    orderBy?: EventsTypesOrderByWithRelationInput | EventsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventsTypes.
     */
    cursor?: EventsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventsTypes.
     */
    distinct?: EventsTypesScalarFieldEnum | EventsTypesScalarFieldEnum[]
  }

  /**
   * EventsTypes findFirstOrThrow
   */
  export type EventsTypesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter, which EventsTypes to fetch.
     */
    where?: EventsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventsTypes to fetch.
     */
    orderBy?: EventsTypesOrderByWithRelationInput | EventsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventsTypes.
     */
    cursor?: EventsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventsTypes.
     */
    distinct?: EventsTypesScalarFieldEnum | EventsTypesScalarFieldEnum[]
  }

  /**
   * EventsTypes findMany
   */
  export type EventsTypesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter, which EventsTypes to fetch.
     */
    where?: EventsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventsTypes to fetch.
     */
    orderBy?: EventsTypesOrderByWithRelationInput | EventsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventsTypes.
     */
    cursor?: EventsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventsTypes.
     */
    skip?: number
    distinct?: EventsTypesScalarFieldEnum | EventsTypesScalarFieldEnum[]
  }

  /**
   * EventsTypes create
   */
  export type EventsTypesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * The data needed to create a EventsTypes.
     */
    data: XOR<EventsTypesCreateInput, EventsTypesUncheckedCreateInput>
  }

  /**
   * EventsTypes createMany
   */
  export type EventsTypesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventsTypes.
     */
    data: EventsTypesCreateManyInput | EventsTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventsTypes createManyAndReturn
   */
  export type EventsTypesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * The data used to create many EventsTypes.
     */
    data: EventsTypesCreateManyInput | EventsTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventsTypes update
   */
  export type EventsTypesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * The data needed to update a EventsTypes.
     */
    data: XOR<EventsTypesUpdateInput, EventsTypesUncheckedUpdateInput>
    /**
     * Choose, which EventsTypes to update.
     */
    where: EventsTypesWhereUniqueInput
  }

  /**
   * EventsTypes updateMany
   */
  export type EventsTypesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventsTypes.
     */
    data: XOR<EventsTypesUpdateManyMutationInput, EventsTypesUncheckedUpdateManyInput>
    /**
     * Filter which EventsTypes to update
     */
    where?: EventsTypesWhereInput
    /**
     * Limit how many EventsTypes to update.
     */
    limit?: number
  }

  /**
   * EventsTypes updateManyAndReturn
   */
  export type EventsTypesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * The data used to update EventsTypes.
     */
    data: XOR<EventsTypesUpdateManyMutationInput, EventsTypesUncheckedUpdateManyInput>
    /**
     * Filter which EventsTypes to update
     */
    where?: EventsTypesWhereInput
    /**
     * Limit how many EventsTypes to update.
     */
    limit?: number
  }

  /**
   * EventsTypes upsert
   */
  export type EventsTypesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * The filter to search for the EventsTypes to update in case it exists.
     */
    where: EventsTypesWhereUniqueInput
    /**
     * In case the EventsTypes found by the `where` argument doesn't exist, create a new EventsTypes with this data.
     */
    create: XOR<EventsTypesCreateInput, EventsTypesUncheckedCreateInput>
    /**
     * In case the EventsTypes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventsTypesUpdateInput, EventsTypesUncheckedUpdateInput>
  }

  /**
   * EventsTypes delete
   */
  export type EventsTypesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
    /**
     * Filter which EventsTypes to delete.
     */
    where: EventsTypesWhereUniqueInput
  }

  /**
   * EventsTypes deleteMany
   */
  export type EventsTypesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventsTypes to delete
     */
    where?: EventsTypesWhereInput
    /**
     * Limit how many EventsTypes to delete.
     */
    limit?: number
  }

  /**
   * EventsTypes.events
   */
  export type EventsTypes$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    cursor?: EventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * EventsTypes without action
   */
  export type EventsTypesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventsTypes
     */
    select?: EventsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventsTypes
     */
    omit?: EventsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsTypesInclude<ExtArgs> | null
  }


  /**
   * Model Events
   */

  export type AggregateEvents = {
    _count: EventsCountAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  export type EventsMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: string | null
    siteId: string | null
    eventTypeId: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: string | null
    siteId: string | null
    eventTypeId: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventsCountAggregateOutputType = {
    id: number
    name: number
    description: number
    status: number
    siteId: number
    eventTypeId: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventsMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    siteId?: true
    eventTypeId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventsMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    siteId?: true
    eventTypeId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventsCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    siteId?: true
    eventTypeId?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to aggregate.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventsMaxAggregateInputType
  }

  export type GetEventsAggregateType<T extends EventsAggregateArgs> = {
        [P in keyof T & keyof AggregateEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvents[P]>
      : GetScalarType<T[P], AggregateEvents[P]>
  }




  export type EventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventsWhereInput
    orderBy?: EventsOrderByWithAggregationInput | EventsOrderByWithAggregationInput[]
    by: EventsScalarFieldEnum[] | EventsScalarFieldEnum
    having?: EventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventsCountAggregateInputType | true
    _min?: EventsMinAggregateInputType
    _max?: EventsMaxAggregateInputType
  }

  export type EventsGroupByOutputType = {
    id: string
    name: string
    description: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
    _count: EventsCountAggregateOutputType | null
    _min: EventsMinAggregateOutputType | null
    _max: EventsMaxAggregateOutputType | null
  }

  type GetEventsGroupByPayload<T extends EventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventsGroupByOutputType[P]>
            : GetScalarType<T[P], EventsGroupByOutputType[P]>
        }
      >
    >


  export type EventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    siteId?: boolean
    eventTypeId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
    programs?: boolean | Events$programsArgs<ExtArgs>
    artists?: boolean | Events$artistsArgs<ExtArgs>
    quizzes?: boolean | Events$quizzesArgs<ExtArgs>
    _count?: boolean | EventsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    siteId?: boolean
    eventTypeId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    siteId?: boolean
    eventTypeId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["events"]>

  export type EventsSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    siteId?: boolean
    eventTypeId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "status" | "siteId" | "eventTypeId" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["events"]>
  export type EventsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
    programs?: boolean | Events$programsArgs<ExtArgs>
    artists?: boolean | Events$artistsArgs<ExtArgs>
    quizzes?: boolean | Events$quizzesArgs<ExtArgs>
    _count?: boolean | EventsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
  }
  export type EventsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    site?: boolean | SitesDefaultArgs<ExtArgs>
    eventType?: boolean | EventsTypesDefaultArgs<ExtArgs>
  }

  export type $EventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Events"
    objects: {
      site: Prisma.$SitesPayload<ExtArgs>
      eventType: Prisma.$EventsTypesPayload<ExtArgs>
      programs: Prisma.$ProgramsPayload<ExtArgs>[]
      artists: Prisma.$ArtistsPayload<ExtArgs>[]
      quizzes: Prisma.$QuizPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      status: string
      siteId: string
      eventTypeId: string
      createdBy: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["events"]>
    composites: {}
  }

  type EventsGetPayload<S extends boolean | null | undefined | EventsDefaultArgs> = $Result.GetResult<Prisma.$EventsPayload, S>

  type EventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventsCountAggregateInputType | true
    }

  export interface EventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Events'], meta: { name: 'Events' } }
    /**
     * Find zero or one Events that matches the filter.
     * @param {EventsFindUniqueArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventsFindUniqueArgs>(args: SelectSubset<T, EventsFindUniqueArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Events that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventsFindUniqueOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventsFindUniqueOrThrowArgs>(args: SelectSubset<T, EventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindFirstArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventsFindFirstArgs>(args?: SelectSubset<T, EventsFindFirstArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindFirstOrThrowArgs} args - Arguments to find a Events
     * @example
     * // Get one Events
     * const events = await prisma.events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventsFindFirstOrThrowArgs>(args?: SelectSubset<T, EventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.events.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.events.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventsWithIdOnly = await prisma.events.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventsFindManyArgs>(args?: SelectSubset<T, EventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Events.
     * @param {EventsCreateArgs} args - Arguments to create a Events.
     * @example
     * // Create one Events
     * const Events = await prisma.events.create({
     *   data: {
     *     // ... data to create a Events
     *   }
     * })
     * 
     */
    create<T extends EventsCreateArgs>(args: SelectSubset<T, EventsCreateArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventsCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventsCreateManyArgs>(args?: SelectSubset<T, EventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventsCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const events = await prisma.events.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventsWithIdOnly = await prisma.events.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventsCreateManyAndReturnArgs>(args?: SelectSubset<T, EventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Events.
     * @param {EventsDeleteArgs} args - Arguments to delete one Events.
     * @example
     * // Delete one Events
     * const Events = await prisma.events.delete({
     *   where: {
     *     // ... filter to delete one Events
     *   }
     * })
     * 
     */
    delete<T extends EventsDeleteArgs>(args: SelectSubset<T, EventsDeleteArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Events.
     * @param {EventsUpdateArgs} args - Arguments to update one Events.
     * @example
     * // Update one Events
     * const events = await prisma.events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventsUpdateArgs>(args: SelectSubset<T, EventsUpdateArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventsDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventsDeleteManyArgs>(args?: SelectSubset<T, EventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventsUpdateManyArgs>(args: SelectSubset<T, EventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventsUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const events = await prisma.events.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventsWithIdOnly = await prisma.events.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventsUpdateManyAndReturnArgs>(args: SelectSubset<T, EventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Events.
     * @param {EventsUpsertArgs} args - Arguments to update or create a Events.
     * @example
     * // Update or create a Events
     * const events = await prisma.events.upsert({
     *   create: {
     *     // ... data to create a Events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Events we want to update
     *   }
     * })
     */
    upsert<T extends EventsUpsertArgs>(args: SelectSubset<T, EventsUpsertArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.events.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventsCountArgs>(
      args?: Subset<T, EventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventsAggregateArgs>(args: Subset<T, EventsAggregateArgs>): Prisma.PrismaPromise<GetEventsAggregateType<T>>

    /**
     * Group by Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventsGroupByArgs['orderBy'] }
        : { orderBy?: EventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Events model
   */
  readonly fields: EventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Events.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    site<T extends SitesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SitesDefaultArgs<ExtArgs>>): Prisma__SitesClient<$Result.GetResult<Prisma.$SitesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    eventType<T extends EventsTypesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventsTypesDefaultArgs<ExtArgs>>): Prisma__EventsTypesClient<$Result.GetResult<Prisma.$EventsTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    programs<T extends Events$programsArgs<ExtArgs> = {}>(args?: Subset<T, Events$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    artists<T extends Events$artistsArgs<ExtArgs> = {}>(args?: Subset<T, Events$artistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quizzes<T extends Events$quizzesArgs<ExtArgs> = {}>(args?: Subset<T, Events$quizzesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Events model
   */
  interface EventsFieldRefs {
    readonly id: FieldRef<"Events", 'String'>
    readonly name: FieldRef<"Events", 'String'>
    readonly description: FieldRef<"Events", 'String'>
    readonly status: FieldRef<"Events", 'String'>
    readonly siteId: FieldRef<"Events", 'String'>
    readonly eventTypeId: FieldRef<"Events", 'String'>
    readonly createdBy: FieldRef<"Events", 'String'>
    readonly createdAt: FieldRef<"Events", 'DateTime'>
    readonly updatedAt: FieldRef<"Events", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Events findUnique
   */
  export type EventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events findUniqueOrThrow
   */
  export type EventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events findFirst
   */
  export type EventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events findFirstOrThrow
   */
  export type EventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events findMany
   */
  export type EventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventsOrderByWithRelationInput | EventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventsScalarFieldEnum | EventsScalarFieldEnum[]
  }

  /**
   * Events create
   */
  export type EventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The data needed to create a Events.
     */
    data: XOR<EventsCreateInput, EventsUncheckedCreateInput>
  }

  /**
   * Events createMany
   */
  export type EventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventsCreateManyInput | EventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Events createManyAndReturn
   */
  export type EventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventsCreateManyInput | EventsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Events update
   */
  export type EventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The data needed to update a Events.
     */
    data: XOR<EventsUpdateInput, EventsUncheckedUpdateInput>
    /**
     * Choose, which Events to update.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events updateMany
   */
  export type EventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Events updateManyAndReturn
   */
  export type EventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Events upsert
   */
  export type EventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * The filter to search for the Events to update in case it exists.
     */
    where: EventsWhereUniqueInput
    /**
     * In case the Events found by the `where` argument doesn't exist, create a new Events with this data.
     */
    create: XOR<EventsCreateInput, EventsUncheckedCreateInput>
    /**
     * In case the Events was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventsUpdateInput, EventsUncheckedUpdateInput>
  }

  /**
   * Events delete
   */
  export type EventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
    /**
     * Filter which Events to delete.
     */
    where: EventsWhereUniqueInput
  }

  /**
   * Events deleteMany
   */
  export type EventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventsWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Events.programs
   */
  export type Events$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    where?: ProgramsWhereInput
    orderBy?: ProgramsOrderByWithRelationInput | ProgramsOrderByWithRelationInput[]
    cursor?: ProgramsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramsScalarFieldEnum | ProgramsScalarFieldEnum[]
  }

  /**
   * Events.artists
   */
  export type Events$artistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    where?: ArtistsWhereInput
    orderBy?: ArtistsOrderByWithRelationInput | ArtistsOrderByWithRelationInput[]
    cursor?: ArtistsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArtistsScalarFieldEnum | ArtistsScalarFieldEnum[]
  }

  /**
   * Events.quizzes
   */
  export type Events$quizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    cursor?: QuizWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Events without action
   */
  export type EventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Events
     */
    select?: EventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Events
     */
    omit?: EventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventsInclude<ExtArgs> | null
  }


  /**
   * Model Programs
   */

  export type AggregatePrograms = {
    _count: ProgramsCountAggregateOutputType | null
    _min: ProgramsMinAggregateOutputType | null
    _max: ProgramsMaxAggregateOutputType | null
  }

  export type ProgramsMinAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramsMaxAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramsCountAggregateOutputType = {
    id: number
    startTime: number
    endTime: number
    eventId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgramsMinAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramsMaxAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramsCountAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgramsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programs to aggregate.
     */
    where?: ProgramsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramsOrderByWithRelationInput | ProgramsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Programs
    **/
    _count?: true | ProgramsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramsMaxAggregateInputType
  }

  export type GetProgramsAggregateType<T extends ProgramsAggregateArgs> = {
        [P in keyof T & keyof AggregatePrograms]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrograms[P]>
      : GetScalarType<T[P], AggregatePrograms[P]>
  }




  export type ProgramsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramsWhereInput
    orderBy?: ProgramsOrderByWithAggregationInput | ProgramsOrderByWithAggregationInput[]
    by: ProgramsScalarFieldEnum[] | ProgramsScalarFieldEnum
    having?: ProgramsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramsCountAggregateInputType | true
    _min?: ProgramsMinAggregateInputType
    _max?: ProgramsMaxAggregateInputType
  }

  export type ProgramsGroupByOutputType = {
    id: string
    startTime: Date
    endTime: Date
    eventId: string
    createdAt: Date
    updatedAt: Date
    _count: ProgramsCountAggregateOutputType | null
    _min: ProgramsMinAggregateOutputType | null
    _max: ProgramsMaxAggregateOutputType | null
  }

  type GetProgramsGroupByPayload<T extends ProgramsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramsGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramsGroupByOutputType[P]>
        }
      >
    >


  export type ProgramsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programs"]>

  export type ProgramsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programs"]>

  export type ProgramsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programs"]>

  export type ProgramsSelectScalar = {
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProgramsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "startTime" | "endTime" | "eventId" | "createdAt" | "updatedAt", ExtArgs["result"]["programs"]>
  export type ProgramsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }
  export type ProgramsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }
  export type ProgramsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }

  export type $ProgramsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Programs"
    objects: {
      event: Prisma.$EventsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      startTime: Date
      endTime: Date
      eventId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["programs"]>
    composites: {}
  }

  type ProgramsGetPayload<S extends boolean | null | undefined | ProgramsDefaultArgs> = $Result.GetResult<Prisma.$ProgramsPayload, S>

  type ProgramsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgramsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgramsCountAggregateInputType | true
    }

  export interface ProgramsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Programs'], meta: { name: 'Programs' } }
    /**
     * Find zero or one Programs that matches the filter.
     * @param {ProgramsFindUniqueArgs} args - Arguments to find a Programs
     * @example
     * // Get one Programs
     * const programs = await prisma.programs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramsFindUniqueArgs>(args: SelectSubset<T, ProgramsFindUniqueArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Programs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgramsFindUniqueOrThrowArgs} args - Arguments to find a Programs
     * @example
     * // Get one Programs
     * const programs = await prisma.programs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramsFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Programs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsFindFirstArgs} args - Arguments to find a Programs
     * @example
     * // Get one Programs
     * const programs = await prisma.programs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramsFindFirstArgs>(args?: SelectSubset<T, ProgramsFindFirstArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Programs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsFindFirstOrThrowArgs} args - Arguments to find a Programs
     * @example
     * // Get one Programs
     * const programs = await prisma.programs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramsFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Programs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Programs
     * const programs = await prisma.programs.findMany()
     * 
     * // Get first 10 Programs
     * const programs = await prisma.programs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programsWithIdOnly = await prisma.programs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgramsFindManyArgs>(args?: SelectSubset<T, ProgramsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Programs.
     * @param {ProgramsCreateArgs} args - Arguments to create a Programs.
     * @example
     * // Create one Programs
     * const Programs = await prisma.programs.create({
     *   data: {
     *     // ... data to create a Programs
     *   }
     * })
     * 
     */
    create<T extends ProgramsCreateArgs>(args: SelectSubset<T, ProgramsCreateArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Programs.
     * @param {ProgramsCreateManyArgs} args - Arguments to create many Programs.
     * @example
     * // Create many Programs
     * const programs = await prisma.programs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramsCreateManyArgs>(args?: SelectSubset<T, ProgramsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Programs and returns the data saved in the database.
     * @param {ProgramsCreateManyAndReturnArgs} args - Arguments to create many Programs.
     * @example
     * // Create many Programs
     * const programs = await prisma.programs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Programs and only return the `id`
     * const programsWithIdOnly = await prisma.programs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgramsCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgramsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Programs.
     * @param {ProgramsDeleteArgs} args - Arguments to delete one Programs.
     * @example
     * // Delete one Programs
     * const Programs = await prisma.programs.delete({
     *   where: {
     *     // ... filter to delete one Programs
     *   }
     * })
     * 
     */
    delete<T extends ProgramsDeleteArgs>(args: SelectSubset<T, ProgramsDeleteArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Programs.
     * @param {ProgramsUpdateArgs} args - Arguments to update one Programs.
     * @example
     * // Update one Programs
     * const programs = await prisma.programs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramsUpdateArgs>(args: SelectSubset<T, ProgramsUpdateArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Programs.
     * @param {ProgramsDeleteManyArgs} args - Arguments to filter Programs to delete.
     * @example
     * // Delete a few Programs
     * const { count } = await prisma.programs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramsDeleteManyArgs>(args?: SelectSubset<T, ProgramsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Programs
     * const programs = await prisma.programs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramsUpdateManyArgs>(args: SelectSubset<T, ProgramsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programs and returns the data updated in the database.
     * @param {ProgramsUpdateManyAndReturnArgs} args - Arguments to update many Programs.
     * @example
     * // Update many Programs
     * const programs = await prisma.programs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Programs and only return the `id`
     * const programsWithIdOnly = await prisma.programs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgramsUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgramsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Programs.
     * @param {ProgramsUpsertArgs} args - Arguments to update or create a Programs.
     * @example
     * // Update or create a Programs
     * const programs = await prisma.programs.upsert({
     *   create: {
     *     // ... data to create a Programs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Programs we want to update
     *   }
     * })
     */
    upsert<T extends ProgramsUpsertArgs>(args: SelectSubset<T, ProgramsUpsertArgs<ExtArgs>>): Prisma__ProgramsClient<$Result.GetResult<Prisma.$ProgramsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsCountArgs} args - Arguments to filter Programs to count.
     * @example
     * // Count the number of Programs
     * const count = await prisma.programs.count({
     *   where: {
     *     // ... the filter for the Programs we want to count
     *   }
     * })
    **/
    count<T extends ProgramsCountArgs>(
      args?: Subset<T, ProgramsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgramsAggregateArgs>(args: Subset<T, ProgramsAggregateArgs>): Prisma.PrismaPromise<GetProgramsAggregateType<T>>

    /**
     * Group by Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgramsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramsGroupByArgs['orderBy'] }
        : { orderBy?: ProgramsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgramsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Programs model
   */
  readonly fields: ProgramsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Programs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventsDefaultArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Programs model
   */
  interface ProgramsFieldRefs {
    readonly id: FieldRef<"Programs", 'String'>
    readonly startTime: FieldRef<"Programs", 'DateTime'>
    readonly endTime: FieldRef<"Programs", 'DateTime'>
    readonly eventId: FieldRef<"Programs", 'String'>
    readonly createdAt: FieldRef<"Programs", 'DateTime'>
    readonly updatedAt: FieldRef<"Programs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Programs findUnique
   */
  export type ProgramsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where: ProgramsWhereUniqueInput
  }

  /**
   * Programs findUniqueOrThrow
   */
  export type ProgramsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where: ProgramsWhereUniqueInput
  }

  /**
   * Programs findFirst
   */
  export type ProgramsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where?: ProgramsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramsOrderByWithRelationInput | ProgramsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramsScalarFieldEnum | ProgramsScalarFieldEnum[]
  }

  /**
   * Programs findFirstOrThrow
   */
  export type ProgramsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where?: ProgramsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramsOrderByWithRelationInput | ProgramsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramsScalarFieldEnum | ProgramsScalarFieldEnum[]
  }

  /**
   * Programs findMany
   */
  export type ProgramsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where?: ProgramsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramsOrderByWithRelationInput | ProgramsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Programs.
     */
    cursor?: ProgramsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    distinct?: ProgramsScalarFieldEnum | ProgramsScalarFieldEnum[]
  }

  /**
   * Programs create
   */
  export type ProgramsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * The data needed to create a Programs.
     */
    data: XOR<ProgramsCreateInput, ProgramsUncheckedCreateInput>
  }

  /**
   * Programs createMany
   */
  export type ProgramsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Programs.
     */
    data: ProgramsCreateManyInput | ProgramsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Programs createManyAndReturn
   */
  export type ProgramsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * The data used to create many Programs.
     */
    data: ProgramsCreateManyInput | ProgramsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Programs update
   */
  export type ProgramsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * The data needed to update a Programs.
     */
    data: XOR<ProgramsUpdateInput, ProgramsUncheckedUpdateInput>
    /**
     * Choose, which Programs to update.
     */
    where: ProgramsWhereUniqueInput
  }

  /**
   * Programs updateMany
   */
  export type ProgramsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Programs.
     */
    data: XOR<ProgramsUpdateManyMutationInput, ProgramsUncheckedUpdateManyInput>
    /**
     * Filter which Programs to update
     */
    where?: ProgramsWhereInput
    /**
     * Limit how many Programs to update.
     */
    limit?: number
  }

  /**
   * Programs updateManyAndReturn
   */
  export type ProgramsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * The data used to update Programs.
     */
    data: XOR<ProgramsUpdateManyMutationInput, ProgramsUncheckedUpdateManyInput>
    /**
     * Filter which Programs to update
     */
    where?: ProgramsWhereInput
    /**
     * Limit how many Programs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Programs upsert
   */
  export type ProgramsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * The filter to search for the Programs to update in case it exists.
     */
    where: ProgramsWhereUniqueInput
    /**
     * In case the Programs found by the `where` argument doesn't exist, create a new Programs with this data.
     */
    create: XOR<ProgramsCreateInput, ProgramsUncheckedCreateInput>
    /**
     * In case the Programs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramsUpdateInput, ProgramsUncheckedUpdateInput>
  }

  /**
   * Programs delete
   */
  export type ProgramsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
    /**
     * Filter which Programs to delete.
     */
    where: ProgramsWhereUniqueInput
  }

  /**
   * Programs deleteMany
   */
  export type ProgramsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programs to delete
     */
    where?: ProgramsWhereInput
    /**
     * Limit how many Programs to delete.
     */
    limit?: number
  }

  /**
   * Programs without action
   */
  export type ProgramsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programs
     */
    select?: ProgramsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programs
     */
    omit?: ProgramsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramsInclude<ExtArgs> | null
  }


  /**
   * Model Artists
   */

  export type AggregateArtists = {
    _count: ArtistsCountAggregateOutputType | null
    _min: ArtistsMinAggregateOutputType | null
    _max: ArtistsMaxAggregateOutputType | null
  }

  export type ArtistsMinAggregateOutputType = {
    id: string | null
    name: string | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArtistsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArtistsCountAggregateOutputType = {
    id: number
    name: number
    eventId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArtistsMinAggregateInputType = {
    id?: true
    name?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArtistsMaxAggregateInputType = {
    id?: true
    name?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArtistsCountAggregateInputType = {
    id?: true
    name?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArtistsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Artists to aggregate.
     */
    where?: ArtistsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistsOrderByWithRelationInput | ArtistsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArtistsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Artists
    **/
    _count?: true | ArtistsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArtistsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArtistsMaxAggregateInputType
  }

  export type GetArtistsAggregateType<T extends ArtistsAggregateArgs> = {
        [P in keyof T & keyof AggregateArtists]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArtists[P]>
      : GetScalarType<T[P], AggregateArtists[P]>
  }




  export type ArtistsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArtistsWhereInput
    orderBy?: ArtistsOrderByWithAggregationInput | ArtistsOrderByWithAggregationInput[]
    by: ArtistsScalarFieldEnum[] | ArtistsScalarFieldEnum
    having?: ArtistsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArtistsCountAggregateInputType | true
    _min?: ArtistsMinAggregateInputType
    _max?: ArtistsMaxAggregateInputType
  }

  export type ArtistsGroupByOutputType = {
    id: string
    name: string
    eventId: string
    createdAt: Date
    updatedAt: Date
    _count: ArtistsCountAggregateOutputType | null
    _min: ArtistsMinAggregateOutputType | null
    _max: ArtistsMaxAggregateOutputType | null
  }

  type GetArtistsGroupByPayload<T extends ArtistsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArtistsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArtistsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArtistsGroupByOutputType[P]>
            : GetScalarType<T[P], ArtistsGroupByOutputType[P]>
        }
      >
    >


  export type ArtistsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["artists"]>

  export type ArtistsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["artists"]>

  export type ArtistsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["artists"]>

  export type ArtistsSelectScalar = {
    id?: boolean
    name?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArtistsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "eventId" | "createdAt" | "updatedAt", ExtArgs["result"]["artists"]>
  export type ArtistsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }
  export type ArtistsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }
  export type ArtistsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }

  export type $ArtistsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Artists"
    objects: {
      event: Prisma.$EventsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      eventId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["artists"]>
    composites: {}
  }

  type ArtistsGetPayload<S extends boolean | null | undefined | ArtistsDefaultArgs> = $Result.GetResult<Prisma.$ArtistsPayload, S>

  type ArtistsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArtistsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArtistsCountAggregateInputType | true
    }

  export interface ArtistsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Artists'], meta: { name: 'Artists' } }
    /**
     * Find zero or one Artists that matches the filter.
     * @param {ArtistsFindUniqueArgs} args - Arguments to find a Artists
     * @example
     * // Get one Artists
     * const artists = await prisma.artists.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArtistsFindUniqueArgs>(args: SelectSubset<T, ArtistsFindUniqueArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Artists that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArtistsFindUniqueOrThrowArgs} args - Arguments to find a Artists
     * @example
     * // Get one Artists
     * const artists = await prisma.artists.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArtistsFindUniqueOrThrowArgs>(args: SelectSubset<T, ArtistsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Artists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsFindFirstArgs} args - Arguments to find a Artists
     * @example
     * // Get one Artists
     * const artists = await prisma.artists.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArtistsFindFirstArgs>(args?: SelectSubset<T, ArtistsFindFirstArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Artists that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsFindFirstOrThrowArgs} args - Arguments to find a Artists
     * @example
     * // Get one Artists
     * const artists = await prisma.artists.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArtistsFindFirstOrThrowArgs>(args?: SelectSubset<T, ArtistsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Artists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Artists
     * const artists = await prisma.artists.findMany()
     * 
     * // Get first 10 Artists
     * const artists = await prisma.artists.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const artistsWithIdOnly = await prisma.artists.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArtistsFindManyArgs>(args?: SelectSubset<T, ArtistsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Artists.
     * @param {ArtistsCreateArgs} args - Arguments to create a Artists.
     * @example
     * // Create one Artists
     * const Artists = await prisma.artists.create({
     *   data: {
     *     // ... data to create a Artists
     *   }
     * })
     * 
     */
    create<T extends ArtistsCreateArgs>(args: SelectSubset<T, ArtistsCreateArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Artists.
     * @param {ArtistsCreateManyArgs} args - Arguments to create many Artists.
     * @example
     * // Create many Artists
     * const artists = await prisma.artists.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArtistsCreateManyArgs>(args?: SelectSubset<T, ArtistsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Artists and returns the data saved in the database.
     * @param {ArtistsCreateManyAndReturnArgs} args - Arguments to create many Artists.
     * @example
     * // Create many Artists
     * const artists = await prisma.artists.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Artists and only return the `id`
     * const artistsWithIdOnly = await prisma.artists.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArtistsCreateManyAndReturnArgs>(args?: SelectSubset<T, ArtistsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Artists.
     * @param {ArtistsDeleteArgs} args - Arguments to delete one Artists.
     * @example
     * // Delete one Artists
     * const Artists = await prisma.artists.delete({
     *   where: {
     *     // ... filter to delete one Artists
     *   }
     * })
     * 
     */
    delete<T extends ArtistsDeleteArgs>(args: SelectSubset<T, ArtistsDeleteArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Artists.
     * @param {ArtistsUpdateArgs} args - Arguments to update one Artists.
     * @example
     * // Update one Artists
     * const artists = await prisma.artists.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArtistsUpdateArgs>(args: SelectSubset<T, ArtistsUpdateArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Artists.
     * @param {ArtistsDeleteManyArgs} args - Arguments to filter Artists to delete.
     * @example
     * // Delete a few Artists
     * const { count } = await prisma.artists.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArtistsDeleteManyArgs>(args?: SelectSubset<T, ArtistsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Artists
     * const artists = await prisma.artists.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArtistsUpdateManyArgs>(args: SelectSubset<T, ArtistsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Artists and returns the data updated in the database.
     * @param {ArtistsUpdateManyAndReturnArgs} args - Arguments to update many Artists.
     * @example
     * // Update many Artists
     * const artists = await prisma.artists.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Artists and only return the `id`
     * const artistsWithIdOnly = await prisma.artists.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArtistsUpdateManyAndReturnArgs>(args: SelectSubset<T, ArtistsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Artists.
     * @param {ArtistsUpsertArgs} args - Arguments to update or create a Artists.
     * @example
     * // Update or create a Artists
     * const artists = await prisma.artists.upsert({
     *   create: {
     *     // ... data to create a Artists
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Artists we want to update
     *   }
     * })
     */
    upsert<T extends ArtistsUpsertArgs>(args: SelectSubset<T, ArtistsUpsertArgs<ExtArgs>>): Prisma__ArtistsClient<$Result.GetResult<Prisma.$ArtistsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsCountArgs} args - Arguments to filter Artists to count.
     * @example
     * // Count the number of Artists
     * const count = await prisma.artists.count({
     *   where: {
     *     // ... the filter for the Artists we want to count
     *   }
     * })
    **/
    count<T extends ArtistsCountArgs>(
      args?: Subset<T, ArtistsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArtistsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArtistsAggregateArgs>(args: Subset<T, ArtistsAggregateArgs>): Prisma.PrismaPromise<GetArtistsAggregateType<T>>

    /**
     * Group by Artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArtistsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArtistsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArtistsGroupByArgs['orderBy'] }
        : { orderBy?: ArtistsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArtistsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArtistsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Artists model
   */
  readonly fields: ArtistsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Artists.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArtistsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventsDefaultArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Artists model
   */
  interface ArtistsFieldRefs {
    readonly id: FieldRef<"Artists", 'String'>
    readonly name: FieldRef<"Artists", 'String'>
    readonly eventId: FieldRef<"Artists", 'String'>
    readonly createdAt: FieldRef<"Artists", 'DateTime'>
    readonly updatedAt: FieldRef<"Artists", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Artists findUnique
   */
  export type ArtistsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where: ArtistsWhereUniqueInput
  }

  /**
   * Artists findUniqueOrThrow
   */
  export type ArtistsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where: ArtistsWhereUniqueInput
  }

  /**
   * Artists findFirst
   */
  export type ArtistsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where?: ArtistsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistsOrderByWithRelationInput | ArtistsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Artists.
     */
    cursor?: ArtistsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Artists.
     */
    distinct?: ArtistsScalarFieldEnum | ArtistsScalarFieldEnum[]
  }

  /**
   * Artists findFirstOrThrow
   */
  export type ArtistsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where?: ArtistsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistsOrderByWithRelationInput | ArtistsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Artists.
     */
    cursor?: ArtistsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Artists.
     */
    distinct?: ArtistsScalarFieldEnum | ArtistsScalarFieldEnum[]
  }

  /**
   * Artists findMany
   */
  export type ArtistsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter, which Artists to fetch.
     */
    where?: ArtistsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Artists to fetch.
     */
    orderBy?: ArtistsOrderByWithRelationInput | ArtistsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Artists.
     */
    cursor?: ArtistsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Artists.
     */
    skip?: number
    distinct?: ArtistsScalarFieldEnum | ArtistsScalarFieldEnum[]
  }

  /**
   * Artists create
   */
  export type ArtistsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * The data needed to create a Artists.
     */
    data: XOR<ArtistsCreateInput, ArtistsUncheckedCreateInput>
  }

  /**
   * Artists createMany
   */
  export type ArtistsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Artists.
     */
    data: ArtistsCreateManyInput | ArtistsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Artists createManyAndReturn
   */
  export type ArtistsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * The data used to create many Artists.
     */
    data: ArtistsCreateManyInput | ArtistsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Artists update
   */
  export type ArtistsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * The data needed to update a Artists.
     */
    data: XOR<ArtistsUpdateInput, ArtistsUncheckedUpdateInput>
    /**
     * Choose, which Artists to update.
     */
    where: ArtistsWhereUniqueInput
  }

  /**
   * Artists updateMany
   */
  export type ArtistsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Artists.
     */
    data: XOR<ArtistsUpdateManyMutationInput, ArtistsUncheckedUpdateManyInput>
    /**
     * Filter which Artists to update
     */
    where?: ArtistsWhereInput
    /**
     * Limit how many Artists to update.
     */
    limit?: number
  }

  /**
   * Artists updateManyAndReturn
   */
  export type ArtistsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * The data used to update Artists.
     */
    data: XOR<ArtistsUpdateManyMutationInput, ArtistsUncheckedUpdateManyInput>
    /**
     * Filter which Artists to update
     */
    where?: ArtistsWhereInput
    /**
     * Limit how many Artists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Artists upsert
   */
  export type ArtistsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * The filter to search for the Artists to update in case it exists.
     */
    where: ArtistsWhereUniqueInput
    /**
     * In case the Artists found by the `where` argument doesn't exist, create a new Artists with this data.
     */
    create: XOR<ArtistsCreateInput, ArtistsUncheckedCreateInput>
    /**
     * In case the Artists was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArtistsUpdateInput, ArtistsUncheckedUpdateInput>
  }

  /**
   * Artists delete
   */
  export type ArtistsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
    /**
     * Filter which Artists to delete.
     */
    where: ArtistsWhereUniqueInput
  }

  /**
   * Artists deleteMany
   */
  export type ArtistsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Artists to delete
     */
    where?: ArtistsWhereInput
    /**
     * Limit how many Artists to delete.
     */
    limit?: number
  }

  /**
   * Artists without action
   */
  export type ArtistsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Artists
     */
    select?: ArtistsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Artists
     */
    omit?: ArtistsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArtistsInclude<ExtArgs> | null
  }


  /**
   * Model Quiz
   */

  export type AggregateQuiz = {
    _count: QuizCountAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  export type QuizMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    active: boolean | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuizMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    active: boolean | null
    eventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuizCountAggregateOutputType = {
    id: number
    title: number
    description: number
    active: number
    eventId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuizMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    active?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuizMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    active?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuizCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    active?: true
    eventId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuizAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quiz to aggregate.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quizzes
    **/
    _count?: true | QuizCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizMaxAggregateInputType
  }

  export type GetQuizAggregateType<T extends QuizAggregateArgs> = {
        [P in keyof T & keyof AggregateQuiz]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuiz[P]>
      : GetScalarType<T[P], AggregateQuiz[P]>
  }




  export type QuizGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithAggregationInput | QuizOrderByWithAggregationInput[]
    by: QuizScalarFieldEnum[] | QuizScalarFieldEnum
    having?: QuizScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizCountAggregateInputType | true
    _min?: QuizMinAggregateInputType
    _max?: QuizMaxAggregateInputType
  }

  export type QuizGroupByOutputType = {
    id: string
    title: string
    description: string | null
    active: boolean
    eventId: string
    createdAt: Date
    updatedAt: Date
    _count: QuizCountAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  type GetQuizGroupByPayload<T extends QuizGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizGroupByOutputType[P]>
            : GetScalarType<T[P], QuizGroupByOutputType[P]>
        }
      >
    >


  export type QuizSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    active?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
    questions?: boolean | Quiz$questionsArgs<ExtArgs>
    _count?: boolean | QuizCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    active?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    active?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    active?: boolean
    eventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuizOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "active" | "eventId" | "createdAt" | "updatedAt", ExtArgs["result"]["quiz"]>
  export type QuizInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
    questions?: boolean | Quiz$questionsArgs<ExtArgs>
    _count?: boolean | QuizCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuizIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }
  export type QuizIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventsDefaultArgs<ExtArgs>
  }

  export type $QuizPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quiz"
    objects: {
      event: Prisma.$EventsPayload<ExtArgs>
      questions: Prisma.$QuestionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      active: boolean
      eventId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quiz"]>
    composites: {}
  }

  type QuizGetPayload<S extends boolean | null | undefined | QuizDefaultArgs> = $Result.GetResult<Prisma.$QuizPayload, S>

  type QuizCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizCountAggregateInputType | true
    }

  export interface QuizDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quiz'], meta: { name: 'Quiz' } }
    /**
     * Find zero or one Quiz that matches the filter.
     * @param {QuizFindUniqueArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizFindUniqueArgs>(args: SelectSubset<T, QuizFindUniqueArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Quiz that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizFindUniqueOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quiz that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizFindFirstArgs>(args?: SelectSubset<T, QuizFindFirstArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quiz that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Quizzes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quizzes
     * const quizzes = await prisma.quiz.findMany()
     * 
     * // Get first 10 Quizzes
     * const quizzes = await prisma.quiz.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizWithIdOnly = await prisma.quiz.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizFindManyArgs>(args?: SelectSubset<T, QuizFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Quiz.
     * @param {QuizCreateArgs} args - Arguments to create a Quiz.
     * @example
     * // Create one Quiz
     * const Quiz = await prisma.quiz.create({
     *   data: {
     *     // ... data to create a Quiz
     *   }
     * })
     * 
     */
    create<T extends QuizCreateArgs>(args: SelectSubset<T, QuizCreateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Quizzes.
     * @param {QuizCreateManyArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizCreateManyArgs>(args?: SelectSubset<T, QuizCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quizzes and returns the data saved in the database.
     * @param {QuizCreateManyAndReturnArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quizzes and only return the `id`
     * const quizWithIdOnly = await prisma.quiz.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Quiz.
     * @param {QuizDeleteArgs} args - Arguments to delete one Quiz.
     * @example
     * // Delete one Quiz
     * const Quiz = await prisma.quiz.delete({
     *   where: {
     *     // ... filter to delete one Quiz
     *   }
     * })
     * 
     */
    delete<T extends QuizDeleteArgs>(args: SelectSubset<T, QuizDeleteArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Quiz.
     * @param {QuizUpdateArgs} args - Arguments to update one Quiz.
     * @example
     * // Update one Quiz
     * const quiz = await prisma.quiz.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizUpdateArgs>(args: SelectSubset<T, QuizUpdateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Quizzes.
     * @param {QuizDeleteManyArgs} args - Arguments to filter Quizzes to delete.
     * @example
     * // Delete a few Quizzes
     * const { count } = await prisma.quiz.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizDeleteManyArgs>(args?: SelectSubset<T, QuizDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quizzes
     * const quiz = await prisma.quiz.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizUpdateManyArgs>(args: SelectSubset<T, QuizUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quizzes and returns the data updated in the database.
     * @param {QuizUpdateManyAndReturnArgs} args - Arguments to update many Quizzes.
     * @example
     * // Update many Quizzes
     * const quiz = await prisma.quiz.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Quizzes and only return the `id`
     * const quizWithIdOnly = await prisma.quiz.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuizUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Quiz.
     * @param {QuizUpsertArgs} args - Arguments to update or create a Quiz.
     * @example
     * // Update or create a Quiz
     * const quiz = await prisma.quiz.upsert({
     *   create: {
     *     // ... data to create a Quiz
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quiz we want to update
     *   }
     * })
     */
    upsert<T extends QuizUpsertArgs>(args: SelectSubset<T, QuizUpsertArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizCountArgs} args - Arguments to filter Quizzes to count.
     * @example
     * // Count the number of Quizzes
     * const count = await prisma.quiz.count({
     *   where: {
     *     // ... the filter for the Quizzes we want to count
     *   }
     * })
    **/
    count<T extends QuizCountArgs>(
      args?: Subset<T, QuizCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuizAggregateArgs>(args: Subset<T, QuizAggregateArgs>): Prisma.PrismaPromise<GetQuizAggregateType<T>>

    /**
     * Group by Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuizGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizGroupByArgs['orderBy'] }
        : { orderBy?: QuizGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuizGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quiz model
   */
  readonly fields: QuizFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quiz.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventsDefaultArgs<ExtArgs>>): Prisma__EventsClient<$Result.GetResult<Prisma.$EventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questions<T extends Quiz$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Quiz$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quiz model
   */
  interface QuizFieldRefs {
    readonly id: FieldRef<"Quiz", 'String'>
    readonly title: FieldRef<"Quiz", 'String'>
    readonly description: FieldRef<"Quiz", 'String'>
    readonly active: FieldRef<"Quiz", 'Boolean'>
    readonly eventId: FieldRef<"Quiz", 'String'>
    readonly createdAt: FieldRef<"Quiz", 'DateTime'>
    readonly updatedAt: FieldRef<"Quiz", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Quiz findUnique
   */
  export type QuizFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findUniqueOrThrow
   */
  export type QuizFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findFirst
   */
  export type QuizFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findFirstOrThrow
   */
  export type QuizFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findMany
   */
  export type QuizFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quizzes to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz create
   */
  export type QuizCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to create a Quiz.
     */
    data: XOR<QuizCreateInput, QuizUncheckedCreateInput>
  }

  /**
   * Quiz createMany
   */
  export type QuizCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quiz createManyAndReturn
   */
  export type QuizCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quiz update
   */
  export type QuizUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to update a Quiz.
     */
    data: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
    /**
     * Choose, which Quiz to update.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz updateMany
   */
  export type QuizUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quizzes.
     */
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyInput>
    /**
     * Filter which Quizzes to update
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to update.
     */
    limit?: number
  }

  /**
   * Quiz updateManyAndReturn
   */
  export type QuizUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * The data used to update Quizzes.
     */
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyInput>
    /**
     * Filter which Quizzes to update
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quiz upsert
   */
  export type QuizUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The filter to search for the Quiz to update in case it exists.
     */
    where: QuizWhereUniqueInput
    /**
     * In case the Quiz found by the `where` argument doesn't exist, create a new Quiz with this data.
     */
    create: XOR<QuizCreateInput, QuizUncheckedCreateInput>
    /**
     * In case the Quiz was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
  }

  /**
   * Quiz delete
   */
  export type QuizDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter which Quiz to delete.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz deleteMany
   */
  export type QuizDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quizzes to delete
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to delete.
     */
    limit?: number
  }

  /**
   * Quiz.questions
   */
  export type Quiz$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    where?: QuestionsWhereInput
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    cursor?: QuestionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * Quiz without action
   */
  export type QuizDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
  }


  /**
   * Model QuestionsTypes
   */

  export type AggregateQuestionsTypes = {
    _count: QuestionsTypesCountAggregateOutputType | null
    _min: QuestionsTypesMinAggregateOutputType | null
    _max: QuestionsTypesMaxAggregateOutputType | null
  }

  export type QuestionsTypesMinAggregateOutputType = {
    id: string | null
    types: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionsTypesMaxAggregateOutputType = {
    id: string | null
    types: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionsTypesCountAggregateOutputType = {
    id: number
    types: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuestionsTypesMinAggregateInputType = {
    id?: true
    types?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionsTypesMaxAggregateInputType = {
    id?: true
    types?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionsTypesCountAggregateInputType = {
    id?: true
    types?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuestionsTypesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionsTypes to aggregate.
     */
    where?: QuestionsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionsTypes to fetch.
     */
    orderBy?: QuestionsTypesOrderByWithRelationInput | QuestionsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuestionsTypes
    **/
    _count?: true | QuestionsTypesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionsTypesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionsTypesMaxAggregateInputType
  }

  export type GetQuestionsTypesAggregateType<T extends QuestionsTypesAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestionsTypes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestionsTypes[P]>
      : GetScalarType<T[P], AggregateQuestionsTypes[P]>
  }




  export type QuestionsTypesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionsTypesWhereInput
    orderBy?: QuestionsTypesOrderByWithAggregationInput | QuestionsTypesOrderByWithAggregationInput[]
    by: QuestionsTypesScalarFieldEnum[] | QuestionsTypesScalarFieldEnum
    having?: QuestionsTypesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionsTypesCountAggregateInputType | true
    _min?: QuestionsTypesMinAggregateInputType
    _max?: QuestionsTypesMaxAggregateInputType
  }

  export type QuestionsTypesGroupByOutputType = {
    id: string
    types: string
    createdAt: Date
    updatedAt: Date
    _count: QuestionsTypesCountAggregateOutputType | null
    _min: QuestionsTypesMinAggregateOutputType | null
    _max: QuestionsTypesMaxAggregateOutputType | null
  }

  type GetQuestionsTypesGroupByPayload<T extends QuestionsTypesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionsTypesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionsTypesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionsTypesGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionsTypesGroupByOutputType[P]>
        }
      >
    >


  export type QuestionsTypesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    types?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questions?: boolean | QuestionsTypes$questionsArgs<ExtArgs>
    _count?: boolean | QuestionsTypesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questionsTypes"]>

  export type QuestionsTypesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    types?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["questionsTypes"]>

  export type QuestionsTypesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    types?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["questionsTypes"]>

  export type QuestionsTypesSelectScalar = {
    id?: boolean
    types?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuestionsTypesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "types" | "createdAt" | "updatedAt", ExtArgs["result"]["questionsTypes"]>
  export type QuestionsTypesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuestionsTypes$questionsArgs<ExtArgs>
    _count?: boolean | QuestionsTypesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionsTypesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type QuestionsTypesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $QuestionsTypesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuestionsTypes"
    objects: {
      questions: Prisma.$QuestionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      types: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["questionsTypes"]>
    composites: {}
  }

  type QuestionsTypesGetPayload<S extends boolean | null | undefined | QuestionsTypesDefaultArgs> = $Result.GetResult<Prisma.$QuestionsTypesPayload, S>

  type QuestionsTypesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionsTypesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionsTypesCountAggregateInputType | true
    }

  export interface QuestionsTypesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuestionsTypes'], meta: { name: 'QuestionsTypes' } }
    /**
     * Find zero or one QuestionsTypes that matches the filter.
     * @param {QuestionsTypesFindUniqueArgs} args - Arguments to find a QuestionsTypes
     * @example
     * // Get one QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionsTypesFindUniqueArgs>(args: SelectSubset<T, QuestionsTypesFindUniqueArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuestionsTypes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionsTypesFindUniqueOrThrowArgs} args - Arguments to find a QuestionsTypes
     * @example
     * // Get one QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionsTypesFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionsTypesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuestionsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesFindFirstArgs} args - Arguments to find a QuestionsTypes
     * @example
     * // Get one QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionsTypesFindFirstArgs>(args?: SelectSubset<T, QuestionsTypesFindFirstArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuestionsTypes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesFindFirstOrThrowArgs} args - Arguments to find a QuestionsTypes
     * @example
     * // Get one QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionsTypesFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionsTypesFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuestionsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findMany()
     * 
     * // Get first 10 QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionsTypesWithIdOnly = await prisma.questionsTypes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionsTypesFindManyArgs>(args?: SelectSubset<T, QuestionsTypesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuestionsTypes.
     * @param {QuestionsTypesCreateArgs} args - Arguments to create a QuestionsTypes.
     * @example
     * // Create one QuestionsTypes
     * const QuestionsTypes = await prisma.questionsTypes.create({
     *   data: {
     *     // ... data to create a QuestionsTypes
     *   }
     * })
     * 
     */
    create<T extends QuestionsTypesCreateArgs>(args: SelectSubset<T, QuestionsTypesCreateArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuestionsTypes.
     * @param {QuestionsTypesCreateManyArgs} args - Arguments to create many QuestionsTypes.
     * @example
     * // Create many QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionsTypesCreateManyArgs>(args?: SelectSubset<T, QuestionsTypesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuestionsTypes and returns the data saved in the database.
     * @param {QuestionsTypesCreateManyAndReturnArgs} args - Arguments to create many QuestionsTypes.
     * @example
     * // Create many QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuestionsTypes and only return the `id`
     * const questionsTypesWithIdOnly = await prisma.questionsTypes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionsTypesCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionsTypesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuestionsTypes.
     * @param {QuestionsTypesDeleteArgs} args - Arguments to delete one QuestionsTypes.
     * @example
     * // Delete one QuestionsTypes
     * const QuestionsTypes = await prisma.questionsTypes.delete({
     *   where: {
     *     // ... filter to delete one QuestionsTypes
     *   }
     * })
     * 
     */
    delete<T extends QuestionsTypesDeleteArgs>(args: SelectSubset<T, QuestionsTypesDeleteArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuestionsTypes.
     * @param {QuestionsTypesUpdateArgs} args - Arguments to update one QuestionsTypes.
     * @example
     * // Update one QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionsTypesUpdateArgs>(args: SelectSubset<T, QuestionsTypesUpdateArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuestionsTypes.
     * @param {QuestionsTypesDeleteManyArgs} args - Arguments to filter QuestionsTypes to delete.
     * @example
     * // Delete a few QuestionsTypes
     * const { count } = await prisma.questionsTypes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionsTypesDeleteManyArgs>(args?: SelectSubset<T, QuestionsTypesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuestionsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionsTypesUpdateManyArgs>(args: SelectSubset<T, QuestionsTypesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuestionsTypes and returns the data updated in the database.
     * @param {QuestionsTypesUpdateManyAndReturnArgs} args - Arguments to update many QuestionsTypes.
     * @example
     * // Update many QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuestionsTypes and only return the `id`
     * const questionsTypesWithIdOnly = await prisma.questionsTypes.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionsTypesUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionsTypesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuestionsTypes.
     * @param {QuestionsTypesUpsertArgs} args - Arguments to update or create a QuestionsTypes.
     * @example
     * // Update or create a QuestionsTypes
     * const questionsTypes = await prisma.questionsTypes.upsert({
     *   create: {
     *     // ... data to create a QuestionsTypes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuestionsTypes we want to update
     *   }
     * })
     */
    upsert<T extends QuestionsTypesUpsertArgs>(args: SelectSubset<T, QuestionsTypesUpsertArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuestionsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesCountArgs} args - Arguments to filter QuestionsTypes to count.
     * @example
     * // Count the number of QuestionsTypes
     * const count = await prisma.questionsTypes.count({
     *   where: {
     *     // ... the filter for the QuestionsTypes we want to count
     *   }
     * })
    **/
    count<T extends QuestionsTypesCountArgs>(
      args?: Subset<T, QuestionsTypesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionsTypesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuestionsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionsTypesAggregateArgs>(args: Subset<T, QuestionsTypesAggregateArgs>): Prisma.PrismaPromise<GetQuestionsTypesAggregateType<T>>

    /**
     * Group by QuestionsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsTypesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionsTypesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionsTypesGroupByArgs['orderBy'] }
        : { orderBy?: QuestionsTypesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionsTypesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionsTypesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuestionsTypes model
   */
  readonly fields: QuestionsTypesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuestionsTypes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionsTypesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends QuestionsTypes$questionsArgs<ExtArgs> = {}>(args?: Subset<T, QuestionsTypes$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuestionsTypes model
   */
  interface QuestionsTypesFieldRefs {
    readonly id: FieldRef<"QuestionsTypes", 'String'>
    readonly types: FieldRef<"QuestionsTypes", 'String'>
    readonly createdAt: FieldRef<"QuestionsTypes", 'DateTime'>
    readonly updatedAt: FieldRef<"QuestionsTypes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuestionsTypes findUnique
   */
  export type QuestionsTypesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter, which QuestionsTypes to fetch.
     */
    where: QuestionsTypesWhereUniqueInput
  }

  /**
   * QuestionsTypes findUniqueOrThrow
   */
  export type QuestionsTypesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter, which QuestionsTypes to fetch.
     */
    where: QuestionsTypesWhereUniqueInput
  }

  /**
   * QuestionsTypes findFirst
   */
  export type QuestionsTypesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter, which QuestionsTypes to fetch.
     */
    where?: QuestionsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionsTypes to fetch.
     */
    orderBy?: QuestionsTypesOrderByWithRelationInput | QuestionsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionsTypes.
     */
    cursor?: QuestionsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionsTypes.
     */
    distinct?: QuestionsTypesScalarFieldEnum | QuestionsTypesScalarFieldEnum[]
  }

  /**
   * QuestionsTypes findFirstOrThrow
   */
  export type QuestionsTypesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter, which QuestionsTypes to fetch.
     */
    where?: QuestionsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionsTypes to fetch.
     */
    orderBy?: QuestionsTypesOrderByWithRelationInput | QuestionsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionsTypes.
     */
    cursor?: QuestionsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionsTypes.
     */
    distinct?: QuestionsTypesScalarFieldEnum | QuestionsTypesScalarFieldEnum[]
  }

  /**
   * QuestionsTypes findMany
   */
  export type QuestionsTypesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter, which QuestionsTypes to fetch.
     */
    where?: QuestionsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionsTypes to fetch.
     */
    orderBy?: QuestionsTypesOrderByWithRelationInput | QuestionsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuestionsTypes.
     */
    cursor?: QuestionsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionsTypes.
     */
    skip?: number
    distinct?: QuestionsTypesScalarFieldEnum | QuestionsTypesScalarFieldEnum[]
  }

  /**
   * QuestionsTypes create
   */
  export type QuestionsTypesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * The data needed to create a QuestionsTypes.
     */
    data: XOR<QuestionsTypesCreateInput, QuestionsTypesUncheckedCreateInput>
  }

  /**
   * QuestionsTypes createMany
   */
  export type QuestionsTypesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuestionsTypes.
     */
    data: QuestionsTypesCreateManyInput | QuestionsTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuestionsTypes createManyAndReturn
   */
  export type QuestionsTypesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * The data used to create many QuestionsTypes.
     */
    data: QuestionsTypesCreateManyInput | QuestionsTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuestionsTypes update
   */
  export type QuestionsTypesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * The data needed to update a QuestionsTypes.
     */
    data: XOR<QuestionsTypesUpdateInput, QuestionsTypesUncheckedUpdateInput>
    /**
     * Choose, which QuestionsTypes to update.
     */
    where: QuestionsTypesWhereUniqueInput
  }

  /**
   * QuestionsTypes updateMany
   */
  export type QuestionsTypesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuestionsTypes.
     */
    data: XOR<QuestionsTypesUpdateManyMutationInput, QuestionsTypesUncheckedUpdateManyInput>
    /**
     * Filter which QuestionsTypes to update
     */
    where?: QuestionsTypesWhereInput
    /**
     * Limit how many QuestionsTypes to update.
     */
    limit?: number
  }

  /**
   * QuestionsTypes updateManyAndReturn
   */
  export type QuestionsTypesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * The data used to update QuestionsTypes.
     */
    data: XOR<QuestionsTypesUpdateManyMutationInput, QuestionsTypesUncheckedUpdateManyInput>
    /**
     * Filter which QuestionsTypes to update
     */
    where?: QuestionsTypesWhereInput
    /**
     * Limit how many QuestionsTypes to update.
     */
    limit?: number
  }

  /**
   * QuestionsTypes upsert
   */
  export type QuestionsTypesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * The filter to search for the QuestionsTypes to update in case it exists.
     */
    where: QuestionsTypesWhereUniqueInput
    /**
     * In case the QuestionsTypes found by the `where` argument doesn't exist, create a new QuestionsTypes with this data.
     */
    create: XOR<QuestionsTypesCreateInput, QuestionsTypesUncheckedCreateInput>
    /**
     * In case the QuestionsTypes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionsTypesUpdateInput, QuestionsTypesUncheckedUpdateInput>
  }

  /**
   * QuestionsTypes delete
   */
  export type QuestionsTypesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
    /**
     * Filter which QuestionsTypes to delete.
     */
    where: QuestionsTypesWhereUniqueInput
  }

  /**
   * QuestionsTypes deleteMany
   */
  export type QuestionsTypesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionsTypes to delete
     */
    where?: QuestionsTypesWhereInput
    /**
     * Limit how many QuestionsTypes to delete.
     */
    limit?: number
  }

  /**
   * QuestionsTypes.questions
   */
  export type QuestionsTypes$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    where?: QuestionsWhereInput
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    cursor?: QuestionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * QuestionsTypes without action
   */
  export type QuestionsTypesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionsTypes
     */
    select?: QuestionsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionsTypes
     */
    omit?: QuestionsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsTypesInclude<ExtArgs> | null
  }


  /**
   * Model Questions
   */

  export type AggregateQuestions = {
    _count: QuestionsCountAggregateOutputType | null
    _min: QuestionsMinAggregateOutputType | null
    _max: QuestionsMaxAggregateOutputType | null
  }

  export type QuestionsMinAggregateOutputType = {
    id: string | null
    wording: string | null
    questionTypeId: string | null
    quizId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionsMaxAggregateOutputType = {
    id: string | null
    wording: string | null
    questionTypeId: string | null
    quizId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuestionsCountAggregateOutputType = {
    id: number
    wording: number
    questionTypeId: number
    quizId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuestionsMinAggregateInputType = {
    id?: true
    wording?: true
    questionTypeId?: true
    quizId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionsMaxAggregateInputType = {
    id?: true
    wording?: true
    questionTypeId?: true
    quizId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuestionsCountAggregateInputType = {
    id?: true
    wording?: true
    questionTypeId?: true
    quizId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuestionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to aggregate.
     */
    where?: QuestionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionsMaxAggregateInputType
  }

  export type GetQuestionsAggregateType<T extends QuestionsAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestions[P]>
      : GetScalarType<T[P], AggregateQuestions[P]>
  }




  export type QuestionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionsWhereInput
    orderBy?: QuestionsOrderByWithAggregationInput | QuestionsOrderByWithAggregationInput[]
    by: QuestionsScalarFieldEnum[] | QuestionsScalarFieldEnum
    having?: QuestionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionsCountAggregateInputType | true
    _min?: QuestionsMinAggregateInputType
    _max?: QuestionsMaxAggregateInputType
  }

  export type QuestionsGroupByOutputType = {
    id: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt: Date
    updatedAt: Date
    _count: QuestionsCountAggregateOutputType | null
    _min: QuestionsMinAggregateOutputType | null
    _max: QuestionsMaxAggregateOutputType | null
  }

  type GetQuestionsGroupByPayload<T extends QuestionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionsGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionsGroupByOutputType[P]>
        }
      >
    >


  export type QuestionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionTypeId?: boolean
    quizId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
    impressions?: boolean | Questions$impressionsArgs<ExtArgs>
    choices?: boolean | Questions$choicesArgs<ExtArgs>
    answers?: boolean | Questions$answersArgs<ExtArgs>
    _count?: boolean | QuestionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions"]>

  export type QuestionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionTypeId?: boolean
    quizId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions"]>

  export type QuestionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionTypeId?: boolean
    quizId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions"]>

  export type QuestionsSelectScalar = {
    id?: boolean
    wording?: boolean
    questionTypeId?: boolean
    quizId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuestionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wording" | "questionTypeId" | "quizId" | "createdAt" | "updatedAt", ExtArgs["result"]["questions"]>
  export type QuestionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
    impressions?: boolean | Questions$impressionsArgs<ExtArgs>
    choices?: boolean | Questions$choicesArgs<ExtArgs>
    answers?: boolean | Questions$answersArgs<ExtArgs>
    _count?: boolean | QuestionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
  }
  export type QuestionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questionType?: boolean | QuestionsTypesDefaultArgs<ExtArgs>
    quiz?: boolean | QuizDefaultArgs<ExtArgs>
  }

  export type $QuestionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Questions"
    objects: {
      questionType: Prisma.$QuestionsTypesPayload<ExtArgs>
      quiz: Prisma.$QuizPayload<ExtArgs>
      impressions: Prisma.$Questions_impressionsPayload<ExtArgs>[]
      choices: Prisma.$ChoicesPayload<ExtArgs>[]
      answers: Prisma.$AnswersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wording: string
      questionTypeId: string
      quizId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["questions"]>
    composites: {}
  }

  type QuestionsGetPayload<S extends boolean | null | undefined | QuestionsDefaultArgs> = $Result.GetResult<Prisma.$QuestionsPayload, S>

  type QuestionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionsCountAggregateInputType | true
    }

  export interface QuestionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Questions'], meta: { name: 'Questions' } }
    /**
     * Find zero or one Questions that matches the filter.
     * @param {QuestionsFindUniqueArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionsFindUniqueArgs>(args: SelectSubset<T, QuestionsFindUniqueArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Questions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionsFindUniqueOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionsFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsFindFirstArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionsFindFirstArgs>(args?: SelectSubset<T, QuestionsFindFirstArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsFindFirstOrThrowArgs} args - Arguments to find a Questions
     * @example
     * // Get one Questions
     * const questions = await prisma.questions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionsFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.questions.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.questions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionsWithIdOnly = await prisma.questions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionsFindManyArgs>(args?: SelectSubset<T, QuestionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Questions.
     * @param {QuestionsCreateArgs} args - Arguments to create a Questions.
     * @example
     * // Create one Questions
     * const Questions = await prisma.questions.create({
     *   data: {
     *     // ... data to create a Questions
     *   }
     * })
     * 
     */
    create<T extends QuestionsCreateArgs>(args: SelectSubset<T, QuestionsCreateArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionsCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const questions = await prisma.questions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionsCreateManyArgs>(args?: SelectSubset<T, QuestionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionsCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const questions = await prisma.questions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionsWithIdOnly = await prisma.questions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionsCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Questions.
     * @param {QuestionsDeleteArgs} args - Arguments to delete one Questions.
     * @example
     * // Delete one Questions
     * const Questions = await prisma.questions.delete({
     *   where: {
     *     // ... filter to delete one Questions
     *   }
     * })
     * 
     */
    delete<T extends QuestionsDeleteArgs>(args: SelectSubset<T, QuestionsDeleteArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Questions.
     * @param {QuestionsUpdateArgs} args - Arguments to update one Questions.
     * @example
     * // Update one Questions
     * const questions = await prisma.questions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionsUpdateArgs>(args: SelectSubset<T, QuestionsUpdateArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionsDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.questions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionsDeleteManyArgs>(args?: SelectSubset<T, QuestionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const questions = await prisma.questions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionsUpdateManyArgs>(args: SelectSubset<T, QuestionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionsUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const questions = await prisma.questions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionsWithIdOnly = await prisma.questions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestionsUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Questions.
     * @param {QuestionsUpsertArgs} args - Arguments to update or create a Questions.
     * @example
     * // Update or create a Questions
     * const questions = await prisma.questions.upsert({
     *   create: {
     *     // ... data to create a Questions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Questions we want to update
     *   }
     * })
     */
    upsert<T extends QuestionsUpsertArgs>(args: SelectSubset<T, QuestionsUpsertArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.questions.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionsCountArgs>(
      args?: Subset<T, QuestionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestionsAggregateArgs>(args: Subset<T, QuestionsAggregateArgs>): Prisma.PrismaPromise<GetQuestionsAggregateType<T>>

    /**
     * Group by Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionsGroupByArgs['orderBy'] }
        : { orderBy?: QuestionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Questions model
   */
  readonly fields: QuestionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Questions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questionType<T extends QuestionsTypesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionsTypesDefaultArgs<ExtArgs>>): Prisma__QuestionsTypesClient<$Result.GetResult<Prisma.$QuestionsTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    quiz<T extends QuizDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizDefaultArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    impressions<T extends Questions$impressionsArgs<ExtArgs> = {}>(args?: Subset<T, Questions$impressionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    choices<T extends Questions$choicesArgs<ExtArgs> = {}>(args?: Subset<T, Questions$choicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    answers<T extends Questions$answersArgs<ExtArgs> = {}>(args?: Subset<T, Questions$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Questions model
   */
  interface QuestionsFieldRefs {
    readonly id: FieldRef<"Questions", 'String'>
    readonly wording: FieldRef<"Questions", 'String'>
    readonly questionTypeId: FieldRef<"Questions", 'String'>
    readonly quizId: FieldRef<"Questions", 'String'>
    readonly createdAt: FieldRef<"Questions", 'DateTime'>
    readonly updatedAt: FieldRef<"Questions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Questions findUnique
   */
  export type QuestionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where: QuestionsWhereUniqueInput
  }

  /**
   * Questions findUniqueOrThrow
   */
  export type QuestionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where: QuestionsWhereUniqueInput
  }

  /**
   * Questions findFirst
   */
  export type QuestionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * Questions findFirstOrThrow
   */
  export type QuestionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * Questions findMany
   */
  export type QuestionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionsOrderByWithRelationInput | QuestionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionsScalarFieldEnum | QuestionsScalarFieldEnum[]
  }

  /**
   * Questions create
   */
  export type QuestionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Questions.
     */
    data: XOR<QuestionsCreateInput, QuestionsUncheckedCreateInput>
  }

  /**
   * Questions createMany
   */
  export type QuestionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionsCreateManyInput | QuestionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Questions createManyAndReturn
   */
  export type QuestionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionsCreateManyInput | QuestionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questions update
   */
  export type QuestionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Questions.
     */
    data: XOR<QuestionsUpdateInput, QuestionsUncheckedUpdateInput>
    /**
     * Choose, which Questions to update.
     */
    where: QuestionsWhereUniqueInput
  }

  /**
   * Questions updateMany
   */
  export type QuestionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionsUpdateManyMutationInput, QuestionsUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionsWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Questions updateManyAndReturn
   */
  export type QuestionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionsUpdateManyMutationInput, QuestionsUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionsWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questions upsert
   */
  export type QuestionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Questions to update in case it exists.
     */
    where: QuestionsWhereUniqueInput
    /**
     * In case the Questions found by the `where` argument doesn't exist, create a new Questions with this data.
     */
    create: XOR<QuestionsCreateInput, QuestionsUncheckedCreateInput>
    /**
     * In case the Questions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionsUpdateInput, QuestionsUncheckedUpdateInput>
  }

  /**
   * Questions delete
   */
  export type QuestionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
    /**
     * Filter which Questions to delete.
     */
    where: QuestionsWhereUniqueInput
  }

  /**
   * Questions deleteMany
   */
  export type QuestionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionsWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Questions.impressions
   */
  export type Questions$impressionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    where?: Questions_impressionsWhereInput
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    cursor?: Questions_impressionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Questions_impressionsScalarFieldEnum | Questions_impressionsScalarFieldEnum[]
  }

  /**
   * Questions.choices
   */
  export type Questions$choicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    where?: ChoicesWhereInput
    orderBy?: ChoicesOrderByWithRelationInput | ChoicesOrderByWithRelationInput[]
    cursor?: ChoicesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChoicesScalarFieldEnum | ChoicesScalarFieldEnum[]
  }

  /**
   * Questions.answers
   */
  export type Questions$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    where?: AnswersWhereInput
    orderBy?: AnswersOrderByWithRelationInput | AnswersOrderByWithRelationInput[]
    cursor?: AnswersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * Questions without action
   */
  export type QuestionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions
     */
    select?: QuestionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions
     */
    omit?: QuestionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionsInclude<ExtArgs> | null
  }


  /**
   * Model Impressions
   */

  export type AggregateImpressions = {
    _count: ImpressionsCountAggregateOutputType | null
    _min: ImpressionsMinAggregateOutputType | null
    _max: ImpressionsMaxAggregateOutputType | null
  }

  export type ImpressionsMinAggregateOutputType = {
    id: string | null
    name: string | null
    emoji: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImpressionsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    emoji: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImpressionsCountAggregateOutputType = {
    id: number
    name: number
    emoji: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImpressionsMinAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImpressionsMaxAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImpressionsCountAggregateInputType = {
    id?: true
    name?: true
    emoji?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImpressionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Impressions to aggregate.
     */
    where?: ImpressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Impressions to fetch.
     */
    orderBy?: ImpressionsOrderByWithRelationInput | ImpressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImpressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Impressions
    **/
    _count?: true | ImpressionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImpressionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImpressionsMaxAggregateInputType
  }

  export type GetImpressionsAggregateType<T extends ImpressionsAggregateArgs> = {
        [P in keyof T & keyof AggregateImpressions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImpressions[P]>
      : GetScalarType<T[P], AggregateImpressions[P]>
  }




  export type ImpressionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImpressionsWhereInput
    orderBy?: ImpressionsOrderByWithAggregationInput | ImpressionsOrderByWithAggregationInput[]
    by: ImpressionsScalarFieldEnum[] | ImpressionsScalarFieldEnum
    having?: ImpressionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImpressionsCountAggregateInputType | true
    _min?: ImpressionsMinAggregateInputType
    _max?: ImpressionsMaxAggregateInputType
  }

  export type ImpressionsGroupByOutputType = {
    id: string
    name: string
    emoji: string
    createdAt: Date
    updatedAt: Date
    _count: ImpressionsCountAggregateOutputType | null
    _min: ImpressionsMinAggregateOutputType | null
    _max: ImpressionsMaxAggregateOutputType | null
  }

  type GetImpressionsGroupByPayload<T extends ImpressionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImpressionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImpressionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImpressionsGroupByOutputType[P]>
            : GetScalarType<T[P], ImpressionsGroupByOutputType[P]>
        }
      >
    >


  export type ImpressionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    questions?: boolean | Impressions$questionsArgs<ExtArgs>
    _count?: boolean | ImpressionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["impressions"]>

  export type ImpressionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["impressions"]>

  export type ImpressionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    emoji?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["impressions"]>

  export type ImpressionsSelectScalar = {
    id?: boolean
    name?: boolean
    emoji?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImpressionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "emoji" | "createdAt" | "updatedAt", ExtArgs["result"]["impressions"]>
  export type ImpressionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | Impressions$questionsArgs<ExtArgs>
    _count?: boolean | ImpressionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImpressionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ImpressionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ImpressionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Impressions"
    objects: {
      questions: Prisma.$Questions_impressionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      emoji: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["impressions"]>
    composites: {}
  }

  type ImpressionsGetPayload<S extends boolean | null | undefined | ImpressionsDefaultArgs> = $Result.GetResult<Prisma.$ImpressionsPayload, S>

  type ImpressionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImpressionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImpressionsCountAggregateInputType | true
    }

  export interface ImpressionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Impressions'], meta: { name: 'Impressions' } }
    /**
     * Find zero or one Impressions that matches the filter.
     * @param {ImpressionsFindUniqueArgs} args - Arguments to find a Impressions
     * @example
     * // Get one Impressions
     * const impressions = await prisma.impressions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImpressionsFindUniqueArgs>(args: SelectSubset<T, ImpressionsFindUniqueArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Impressions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImpressionsFindUniqueOrThrowArgs} args - Arguments to find a Impressions
     * @example
     * // Get one Impressions
     * const impressions = await prisma.impressions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImpressionsFindUniqueOrThrowArgs>(args: SelectSubset<T, ImpressionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Impressions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsFindFirstArgs} args - Arguments to find a Impressions
     * @example
     * // Get one Impressions
     * const impressions = await prisma.impressions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImpressionsFindFirstArgs>(args?: SelectSubset<T, ImpressionsFindFirstArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Impressions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsFindFirstOrThrowArgs} args - Arguments to find a Impressions
     * @example
     * // Get one Impressions
     * const impressions = await prisma.impressions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImpressionsFindFirstOrThrowArgs>(args?: SelectSubset<T, ImpressionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Impressions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Impressions
     * const impressions = await prisma.impressions.findMany()
     * 
     * // Get first 10 Impressions
     * const impressions = await prisma.impressions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const impressionsWithIdOnly = await prisma.impressions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImpressionsFindManyArgs>(args?: SelectSubset<T, ImpressionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Impressions.
     * @param {ImpressionsCreateArgs} args - Arguments to create a Impressions.
     * @example
     * // Create one Impressions
     * const Impressions = await prisma.impressions.create({
     *   data: {
     *     // ... data to create a Impressions
     *   }
     * })
     * 
     */
    create<T extends ImpressionsCreateArgs>(args: SelectSubset<T, ImpressionsCreateArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Impressions.
     * @param {ImpressionsCreateManyArgs} args - Arguments to create many Impressions.
     * @example
     * // Create many Impressions
     * const impressions = await prisma.impressions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImpressionsCreateManyArgs>(args?: SelectSubset<T, ImpressionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Impressions and returns the data saved in the database.
     * @param {ImpressionsCreateManyAndReturnArgs} args - Arguments to create many Impressions.
     * @example
     * // Create many Impressions
     * const impressions = await prisma.impressions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Impressions and only return the `id`
     * const impressionsWithIdOnly = await prisma.impressions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImpressionsCreateManyAndReturnArgs>(args?: SelectSubset<T, ImpressionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Impressions.
     * @param {ImpressionsDeleteArgs} args - Arguments to delete one Impressions.
     * @example
     * // Delete one Impressions
     * const Impressions = await prisma.impressions.delete({
     *   where: {
     *     // ... filter to delete one Impressions
     *   }
     * })
     * 
     */
    delete<T extends ImpressionsDeleteArgs>(args: SelectSubset<T, ImpressionsDeleteArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Impressions.
     * @param {ImpressionsUpdateArgs} args - Arguments to update one Impressions.
     * @example
     * // Update one Impressions
     * const impressions = await prisma.impressions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImpressionsUpdateArgs>(args: SelectSubset<T, ImpressionsUpdateArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Impressions.
     * @param {ImpressionsDeleteManyArgs} args - Arguments to filter Impressions to delete.
     * @example
     * // Delete a few Impressions
     * const { count } = await prisma.impressions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImpressionsDeleteManyArgs>(args?: SelectSubset<T, ImpressionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Impressions
     * const impressions = await prisma.impressions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImpressionsUpdateManyArgs>(args: SelectSubset<T, ImpressionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Impressions and returns the data updated in the database.
     * @param {ImpressionsUpdateManyAndReturnArgs} args - Arguments to update many Impressions.
     * @example
     * // Update many Impressions
     * const impressions = await prisma.impressions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Impressions and only return the `id`
     * const impressionsWithIdOnly = await prisma.impressions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImpressionsUpdateManyAndReturnArgs>(args: SelectSubset<T, ImpressionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Impressions.
     * @param {ImpressionsUpsertArgs} args - Arguments to update or create a Impressions.
     * @example
     * // Update or create a Impressions
     * const impressions = await prisma.impressions.upsert({
     *   create: {
     *     // ... data to create a Impressions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Impressions we want to update
     *   }
     * })
     */
    upsert<T extends ImpressionsUpsertArgs>(args: SelectSubset<T, ImpressionsUpsertArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsCountArgs} args - Arguments to filter Impressions to count.
     * @example
     * // Count the number of Impressions
     * const count = await prisma.impressions.count({
     *   where: {
     *     // ... the filter for the Impressions we want to count
     *   }
     * })
    **/
    count<T extends ImpressionsCountArgs>(
      args?: Subset<T, ImpressionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImpressionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImpressionsAggregateArgs>(args: Subset<T, ImpressionsAggregateArgs>): Prisma.PrismaPromise<GetImpressionsAggregateType<T>>

    /**
     * Group by Impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImpressionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImpressionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImpressionsGroupByArgs['orderBy'] }
        : { orderBy?: ImpressionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImpressionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImpressionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Impressions model
   */
  readonly fields: ImpressionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Impressions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImpressionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends Impressions$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Impressions$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Impressions model
   */
  interface ImpressionsFieldRefs {
    readonly id: FieldRef<"Impressions", 'String'>
    readonly name: FieldRef<"Impressions", 'String'>
    readonly emoji: FieldRef<"Impressions", 'String'>
    readonly createdAt: FieldRef<"Impressions", 'DateTime'>
    readonly updatedAt: FieldRef<"Impressions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Impressions findUnique
   */
  export type ImpressionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter, which Impressions to fetch.
     */
    where: ImpressionsWhereUniqueInput
  }

  /**
   * Impressions findUniqueOrThrow
   */
  export type ImpressionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter, which Impressions to fetch.
     */
    where: ImpressionsWhereUniqueInput
  }

  /**
   * Impressions findFirst
   */
  export type ImpressionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter, which Impressions to fetch.
     */
    where?: ImpressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Impressions to fetch.
     */
    orderBy?: ImpressionsOrderByWithRelationInput | ImpressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Impressions.
     */
    cursor?: ImpressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Impressions.
     */
    distinct?: ImpressionsScalarFieldEnum | ImpressionsScalarFieldEnum[]
  }

  /**
   * Impressions findFirstOrThrow
   */
  export type ImpressionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter, which Impressions to fetch.
     */
    where?: ImpressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Impressions to fetch.
     */
    orderBy?: ImpressionsOrderByWithRelationInput | ImpressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Impressions.
     */
    cursor?: ImpressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Impressions.
     */
    distinct?: ImpressionsScalarFieldEnum | ImpressionsScalarFieldEnum[]
  }

  /**
   * Impressions findMany
   */
  export type ImpressionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter, which Impressions to fetch.
     */
    where?: ImpressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Impressions to fetch.
     */
    orderBy?: ImpressionsOrderByWithRelationInput | ImpressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Impressions.
     */
    cursor?: ImpressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Impressions.
     */
    skip?: number
    distinct?: ImpressionsScalarFieldEnum | ImpressionsScalarFieldEnum[]
  }

  /**
   * Impressions create
   */
  export type ImpressionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Impressions.
     */
    data: XOR<ImpressionsCreateInput, ImpressionsUncheckedCreateInput>
  }

  /**
   * Impressions createMany
   */
  export type ImpressionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Impressions.
     */
    data: ImpressionsCreateManyInput | ImpressionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Impressions createManyAndReturn
   */
  export type ImpressionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * The data used to create many Impressions.
     */
    data: ImpressionsCreateManyInput | ImpressionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Impressions update
   */
  export type ImpressionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Impressions.
     */
    data: XOR<ImpressionsUpdateInput, ImpressionsUncheckedUpdateInput>
    /**
     * Choose, which Impressions to update.
     */
    where: ImpressionsWhereUniqueInput
  }

  /**
   * Impressions updateMany
   */
  export type ImpressionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Impressions.
     */
    data: XOR<ImpressionsUpdateManyMutationInput, ImpressionsUncheckedUpdateManyInput>
    /**
     * Filter which Impressions to update
     */
    where?: ImpressionsWhereInput
    /**
     * Limit how many Impressions to update.
     */
    limit?: number
  }

  /**
   * Impressions updateManyAndReturn
   */
  export type ImpressionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * The data used to update Impressions.
     */
    data: XOR<ImpressionsUpdateManyMutationInput, ImpressionsUncheckedUpdateManyInput>
    /**
     * Filter which Impressions to update
     */
    where?: ImpressionsWhereInput
    /**
     * Limit how many Impressions to update.
     */
    limit?: number
  }

  /**
   * Impressions upsert
   */
  export type ImpressionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Impressions to update in case it exists.
     */
    where: ImpressionsWhereUniqueInput
    /**
     * In case the Impressions found by the `where` argument doesn't exist, create a new Impressions with this data.
     */
    create: XOR<ImpressionsCreateInput, ImpressionsUncheckedCreateInput>
    /**
     * In case the Impressions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImpressionsUpdateInput, ImpressionsUncheckedUpdateInput>
  }

  /**
   * Impressions delete
   */
  export type ImpressionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
    /**
     * Filter which Impressions to delete.
     */
    where: ImpressionsWhereUniqueInput
  }

  /**
   * Impressions deleteMany
   */
  export type ImpressionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Impressions to delete
     */
    where?: ImpressionsWhereInput
    /**
     * Limit how many Impressions to delete.
     */
    limit?: number
  }

  /**
   * Impressions.questions
   */
  export type Impressions$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    where?: Questions_impressionsWhereInput
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    cursor?: Questions_impressionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Questions_impressionsScalarFieldEnum | Questions_impressionsScalarFieldEnum[]
  }

  /**
   * Impressions without action
   */
  export type ImpressionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Impressions
     */
    select?: ImpressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Impressions
     */
    omit?: ImpressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImpressionsInclude<ExtArgs> | null
  }


  /**
   * Model Questions_impressions
   */

  export type AggregateQuestions_impressions = {
    _count: Questions_impressionsCountAggregateOutputType | null
    _min: Questions_impressionsMinAggregateOutputType | null
    _max: Questions_impressionsMaxAggregateOutputType | null
  }

  export type Questions_impressionsMinAggregateOutputType = {
    questionId: string | null
    impressionId: string | null
  }

  export type Questions_impressionsMaxAggregateOutputType = {
    questionId: string | null
    impressionId: string | null
  }

  export type Questions_impressionsCountAggregateOutputType = {
    questionId: number
    impressionId: number
    _all: number
  }


  export type Questions_impressionsMinAggregateInputType = {
    questionId?: true
    impressionId?: true
  }

  export type Questions_impressionsMaxAggregateInputType = {
    questionId?: true
    impressionId?: true
  }

  export type Questions_impressionsCountAggregateInputType = {
    questionId?: true
    impressionId?: true
    _all?: true
  }

  export type Questions_impressionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions_impressions to aggregate.
     */
    where?: Questions_impressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions_impressions to fetch.
     */
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Questions_impressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions_impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions_impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions_impressions
    **/
    _count?: true | Questions_impressionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Questions_impressionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Questions_impressionsMaxAggregateInputType
  }

  export type GetQuestions_impressionsAggregateType<T extends Questions_impressionsAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestions_impressions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestions_impressions[P]>
      : GetScalarType<T[P], AggregateQuestions_impressions[P]>
  }




  export type Questions_impressionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Questions_impressionsWhereInput
    orderBy?: Questions_impressionsOrderByWithAggregationInput | Questions_impressionsOrderByWithAggregationInput[]
    by: Questions_impressionsScalarFieldEnum[] | Questions_impressionsScalarFieldEnum
    having?: Questions_impressionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Questions_impressionsCountAggregateInputType | true
    _min?: Questions_impressionsMinAggregateInputType
    _max?: Questions_impressionsMaxAggregateInputType
  }

  export type Questions_impressionsGroupByOutputType = {
    questionId: string
    impressionId: string
    _count: Questions_impressionsCountAggregateOutputType | null
    _min: Questions_impressionsMinAggregateOutputType | null
    _max: Questions_impressionsMaxAggregateOutputType | null
  }

  type GetQuestions_impressionsGroupByPayload<T extends Questions_impressionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Questions_impressionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Questions_impressionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Questions_impressionsGroupByOutputType[P]>
            : GetScalarType<T[P], Questions_impressionsGroupByOutputType[P]>
        }
      >
    >


  export type Questions_impressionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    questionId?: boolean
    impressionId?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions_impressions"]>

  export type Questions_impressionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    questionId?: boolean
    impressionId?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions_impressions"]>

  export type Questions_impressionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    questionId?: boolean
    impressionId?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questions_impressions"]>

  export type Questions_impressionsSelectScalar = {
    questionId?: boolean
    impressionId?: boolean
  }

  export type Questions_impressionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"questionId" | "impressionId", ExtArgs["result"]["questions_impressions"]>
  export type Questions_impressionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }
  export type Questions_impressionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }
  export type Questions_impressionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
    impression?: boolean | ImpressionsDefaultArgs<ExtArgs>
  }

  export type $Questions_impressionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Questions_impressions"
    objects: {
      question: Prisma.$QuestionsPayload<ExtArgs>
      impression: Prisma.$ImpressionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      questionId: string
      impressionId: string
    }, ExtArgs["result"]["questions_impressions"]>
    composites: {}
  }

  type Questions_impressionsGetPayload<S extends boolean | null | undefined | Questions_impressionsDefaultArgs> = $Result.GetResult<Prisma.$Questions_impressionsPayload, S>

  type Questions_impressionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Questions_impressionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Questions_impressionsCountAggregateInputType | true
    }

  export interface Questions_impressionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Questions_impressions'], meta: { name: 'Questions_impressions' } }
    /**
     * Find zero or one Questions_impressions that matches the filter.
     * @param {Questions_impressionsFindUniqueArgs} args - Arguments to find a Questions_impressions
     * @example
     * // Get one Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Questions_impressionsFindUniqueArgs>(args: SelectSubset<T, Questions_impressionsFindUniqueArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Questions_impressions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Questions_impressionsFindUniqueOrThrowArgs} args - Arguments to find a Questions_impressions
     * @example
     * // Get one Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Questions_impressionsFindUniqueOrThrowArgs>(args: SelectSubset<T, Questions_impressionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions_impressions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsFindFirstArgs} args - Arguments to find a Questions_impressions
     * @example
     * // Get one Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Questions_impressionsFindFirstArgs>(args?: SelectSubset<T, Questions_impressionsFindFirstArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questions_impressions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsFindFirstOrThrowArgs} args - Arguments to find a Questions_impressions
     * @example
     * // Get one Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Questions_impressionsFindFirstOrThrowArgs>(args?: SelectSubset<T, Questions_impressionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions_impressions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findMany()
     * 
     * // Get first 10 Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.findMany({ take: 10 })
     * 
     * // Only select the `questionId`
     * const questions_impressionsWithQuestionIdOnly = await prisma.questions_impressions.findMany({ select: { questionId: true } })
     * 
     */
    findMany<T extends Questions_impressionsFindManyArgs>(args?: SelectSubset<T, Questions_impressionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Questions_impressions.
     * @param {Questions_impressionsCreateArgs} args - Arguments to create a Questions_impressions.
     * @example
     * // Create one Questions_impressions
     * const Questions_impressions = await prisma.questions_impressions.create({
     *   data: {
     *     // ... data to create a Questions_impressions
     *   }
     * })
     * 
     */
    create<T extends Questions_impressionsCreateArgs>(args: SelectSubset<T, Questions_impressionsCreateArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions_impressions.
     * @param {Questions_impressionsCreateManyArgs} args - Arguments to create many Questions_impressions.
     * @example
     * // Create many Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Questions_impressionsCreateManyArgs>(args?: SelectSubset<T, Questions_impressionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions_impressions and returns the data saved in the database.
     * @param {Questions_impressionsCreateManyAndReturnArgs} args - Arguments to create many Questions_impressions.
     * @example
     * // Create many Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions_impressions and only return the `questionId`
     * const questions_impressionsWithQuestionIdOnly = await prisma.questions_impressions.createManyAndReturn({
     *   select: { questionId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends Questions_impressionsCreateManyAndReturnArgs>(args?: SelectSubset<T, Questions_impressionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Questions_impressions.
     * @param {Questions_impressionsDeleteArgs} args - Arguments to delete one Questions_impressions.
     * @example
     * // Delete one Questions_impressions
     * const Questions_impressions = await prisma.questions_impressions.delete({
     *   where: {
     *     // ... filter to delete one Questions_impressions
     *   }
     * })
     * 
     */
    delete<T extends Questions_impressionsDeleteArgs>(args: SelectSubset<T, Questions_impressionsDeleteArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Questions_impressions.
     * @param {Questions_impressionsUpdateArgs} args - Arguments to update one Questions_impressions.
     * @example
     * // Update one Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Questions_impressionsUpdateArgs>(args: SelectSubset<T, Questions_impressionsUpdateArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions_impressions.
     * @param {Questions_impressionsDeleteManyArgs} args - Arguments to filter Questions_impressions to delete.
     * @example
     * // Delete a few Questions_impressions
     * const { count } = await prisma.questions_impressions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Questions_impressionsDeleteManyArgs>(args?: SelectSubset<T, Questions_impressionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions_impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Questions_impressionsUpdateManyArgs>(args: SelectSubset<T, Questions_impressionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions_impressions and returns the data updated in the database.
     * @param {Questions_impressionsUpdateManyAndReturnArgs} args - Arguments to update many Questions_impressions.
     * @example
     * // Update many Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions_impressions and only return the `questionId`
     * const questions_impressionsWithQuestionIdOnly = await prisma.questions_impressions.updateManyAndReturn({
     *   select: { questionId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends Questions_impressionsUpdateManyAndReturnArgs>(args: SelectSubset<T, Questions_impressionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Questions_impressions.
     * @param {Questions_impressionsUpsertArgs} args - Arguments to update or create a Questions_impressions.
     * @example
     * // Update or create a Questions_impressions
     * const questions_impressions = await prisma.questions_impressions.upsert({
     *   create: {
     *     // ... data to create a Questions_impressions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Questions_impressions we want to update
     *   }
     * })
     */
    upsert<T extends Questions_impressionsUpsertArgs>(args: SelectSubset<T, Questions_impressionsUpsertArgs<ExtArgs>>): Prisma__Questions_impressionsClient<$Result.GetResult<Prisma.$Questions_impressionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions_impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsCountArgs} args - Arguments to filter Questions_impressions to count.
     * @example
     * // Count the number of Questions_impressions
     * const count = await prisma.questions_impressions.count({
     *   where: {
     *     // ... the filter for the Questions_impressions we want to count
     *   }
     * })
    **/
    count<T extends Questions_impressionsCountArgs>(
      args?: Subset<T, Questions_impressionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Questions_impressionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Questions_impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Questions_impressionsAggregateArgs>(args: Subset<T, Questions_impressionsAggregateArgs>): Prisma.PrismaPromise<GetQuestions_impressionsAggregateType<T>>

    /**
     * Group by Questions_impressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Questions_impressionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Questions_impressionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Questions_impressionsGroupByArgs['orderBy'] }
        : { orderBy?: Questions_impressionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Questions_impressionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestions_impressionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Questions_impressions model
   */
  readonly fields: Questions_impressionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Questions_impressions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Questions_impressionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    question<T extends QuestionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionsDefaultArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    impression<T extends ImpressionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImpressionsDefaultArgs<ExtArgs>>): Prisma__ImpressionsClient<$Result.GetResult<Prisma.$ImpressionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Questions_impressions model
   */
  interface Questions_impressionsFieldRefs {
    readonly questionId: FieldRef<"Questions_impressions", 'String'>
    readonly impressionId: FieldRef<"Questions_impressions", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Questions_impressions findUnique
   */
  export type Questions_impressionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions_impressions to fetch.
     */
    where: Questions_impressionsWhereUniqueInput
  }

  /**
   * Questions_impressions findUniqueOrThrow
   */
  export type Questions_impressionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions_impressions to fetch.
     */
    where: Questions_impressionsWhereUniqueInput
  }

  /**
   * Questions_impressions findFirst
   */
  export type Questions_impressionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions_impressions to fetch.
     */
    where?: Questions_impressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions_impressions to fetch.
     */
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions_impressions.
     */
    cursor?: Questions_impressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions_impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions_impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions_impressions.
     */
    distinct?: Questions_impressionsScalarFieldEnum | Questions_impressionsScalarFieldEnum[]
  }

  /**
   * Questions_impressions findFirstOrThrow
   */
  export type Questions_impressionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions_impressions to fetch.
     */
    where?: Questions_impressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions_impressions to fetch.
     */
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions_impressions.
     */
    cursor?: Questions_impressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions_impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions_impressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions_impressions.
     */
    distinct?: Questions_impressionsScalarFieldEnum | Questions_impressionsScalarFieldEnum[]
  }

  /**
   * Questions_impressions findMany
   */
  export type Questions_impressionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter, which Questions_impressions to fetch.
     */
    where?: Questions_impressionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions_impressions to fetch.
     */
    orderBy?: Questions_impressionsOrderByWithRelationInput | Questions_impressionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions_impressions.
     */
    cursor?: Questions_impressionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions_impressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions_impressions.
     */
    skip?: number
    distinct?: Questions_impressionsScalarFieldEnum | Questions_impressionsScalarFieldEnum[]
  }

  /**
   * Questions_impressions create
   */
  export type Questions_impressionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * The data needed to create a Questions_impressions.
     */
    data: XOR<Questions_impressionsCreateInput, Questions_impressionsUncheckedCreateInput>
  }

  /**
   * Questions_impressions createMany
   */
  export type Questions_impressionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions_impressions.
     */
    data: Questions_impressionsCreateManyInput | Questions_impressionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Questions_impressions createManyAndReturn
   */
  export type Questions_impressionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * The data used to create many Questions_impressions.
     */
    data: Questions_impressionsCreateManyInput | Questions_impressionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questions_impressions update
   */
  export type Questions_impressionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * The data needed to update a Questions_impressions.
     */
    data: XOR<Questions_impressionsUpdateInput, Questions_impressionsUncheckedUpdateInput>
    /**
     * Choose, which Questions_impressions to update.
     */
    where: Questions_impressionsWhereUniqueInput
  }

  /**
   * Questions_impressions updateMany
   */
  export type Questions_impressionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions_impressions.
     */
    data: XOR<Questions_impressionsUpdateManyMutationInput, Questions_impressionsUncheckedUpdateManyInput>
    /**
     * Filter which Questions_impressions to update
     */
    where?: Questions_impressionsWhereInput
    /**
     * Limit how many Questions_impressions to update.
     */
    limit?: number
  }

  /**
   * Questions_impressions updateManyAndReturn
   */
  export type Questions_impressionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * The data used to update Questions_impressions.
     */
    data: XOR<Questions_impressionsUpdateManyMutationInput, Questions_impressionsUncheckedUpdateManyInput>
    /**
     * Filter which Questions_impressions to update
     */
    where?: Questions_impressionsWhereInput
    /**
     * Limit how many Questions_impressions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questions_impressions upsert
   */
  export type Questions_impressionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * The filter to search for the Questions_impressions to update in case it exists.
     */
    where: Questions_impressionsWhereUniqueInput
    /**
     * In case the Questions_impressions found by the `where` argument doesn't exist, create a new Questions_impressions with this data.
     */
    create: XOR<Questions_impressionsCreateInput, Questions_impressionsUncheckedCreateInput>
    /**
     * In case the Questions_impressions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Questions_impressionsUpdateInput, Questions_impressionsUncheckedUpdateInput>
  }

  /**
   * Questions_impressions delete
   */
  export type Questions_impressionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
    /**
     * Filter which Questions_impressions to delete.
     */
    where: Questions_impressionsWhereUniqueInput
  }

  /**
   * Questions_impressions deleteMany
   */
  export type Questions_impressionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions_impressions to delete
     */
    where?: Questions_impressionsWhereInput
    /**
     * Limit how many Questions_impressions to delete.
     */
    limit?: number
  }

  /**
   * Questions_impressions without action
   */
  export type Questions_impressionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questions_impressions
     */
    select?: Questions_impressionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questions_impressions
     */
    omit?: Questions_impressionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Questions_impressionsInclude<ExtArgs> | null
  }


  /**
   * Model Choices
   */

  export type AggregateChoices = {
    _count: ChoicesCountAggregateOutputType | null
    _min: ChoicesMinAggregateOutputType | null
    _max: ChoicesMaxAggregateOutputType | null
  }

  export type ChoicesMinAggregateOutputType = {
    id: string | null
    wording: string | null
    questionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChoicesMaxAggregateOutputType = {
    id: string | null
    wording: string | null
    questionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChoicesCountAggregateOutputType = {
    id: number
    wording: number
    questionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChoicesMinAggregateInputType = {
    id?: true
    wording?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChoicesMaxAggregateInputType = {
    id?: true
    wording?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChoicesCountAggregateInputType = {
    id?: true
    wording?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChoicesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Choices to aggregate.
     */
    where?: ChoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Choices to fetch.
     */
    orderBy?: ChoicesOrderByWithRelationInput | ChoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Choices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Choices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Choices
    **/
    _count?: true | ChoicesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChoicesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChoicesMaxAggregateInputType
  }

  export type GetChoicesAggregateType<T extends ChoicesAggregateArgs> = {
        [P in keyof T & keyof AggregateChoices]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChoices[P]>
      : GetScalarType<T[P], AggregateChoices[P]>
  }




  export type ChoicesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChoicesWhereInput
    orderBy?: ChoicesOrderByWithAggregationInput | ChoicesOrderByWithAggregationInput[]
    by: ChoicesScalarFieldEnum[] | ChoicesScalarFieldEnum
    having?: ChoicesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChoicesCountAggregateInputType | true
    _min?: ChoicesMinAggregateInputType
    _max?: ChoicesMaxAggregateInputType
  }

  export type ChoicesGroupByOutputType = {
    id: string
    wording: string
    questionId: string
    createdAt: Date
    updatedAt: Date
    _count: ChoicesCountAggregateOutputType | null
    _min: ChoicesMinAggregateOutputType | null
    _max: ChoicesMaxAggregateOutputType | null
  }

  type GetChoicesGroupByPayload<T extends ChoicesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChoicesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChoicesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChoicesGroupByOutputType[P]>
            : GetScalarType<T[P], ChoicesGroupByOutputType[P]>
        }
      >
    >


  export type ChoicesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["choices"]>

  export type ChoicesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["choices"]>

  export type ChoicesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wording?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["choices"]>

  export type ChoicesSelectScalar = {
    id?: boolean
    wording?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChoicesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wording" | "questionId" | "createdAt" | "updatedAt", ExtArgs["result"]["choices"]>
  export type ChoicesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }
  export type ChoicesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }
  export type ChoicesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }

  export type $ChoicesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Choices"
    objects: {
      question: Prisma.$QuestionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wording: string
      questionId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["choices"]>
    composites: {}
  }

  type ChoicesGetPayload<S extends boolean | null | undefined | ChoicesDefaultArgs> = $Result.GetResult<Prisma.$ChoicesPayload, S>

  type ChoicesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChoicesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChoicesCountAggregateInputType | true
    }

  export interface ChoicesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Choices'], meta: { name: 'Choices' } }
    /**
     * Find zero or one Choices that matches the filter.
     * @param {ChoicesFindUniqueArgs} args - Arguments to find a Choices
     * @example
     * // Get one Choices
     * const choices = await prisma.choices.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChoicesFindUniqueArgs>(args: SelectSubset<T, ChoicesFindUniqueArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Choices that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChoicesFindUniqueOrThrowArgs} args - Arguments to find a Choices
     * @example
     * // Get one Choices
     * const choices = await prisma.choices.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChoicesFindUniqueOrThrowArgs>(args: SelectSubset<T, ChoicesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Choices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesFindFirstArgs} args - Arguments to find a Choices
     * @example
     * // Get one Choices
     * const choices = await prisma.choices.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChoicesFindFirstArgs>(args?: SelectSubset<T, ChoicesFindFirstArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Choices that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesFindFirstOrThrowArgs} args - Arguments to find a Choices
     * @example
     * // Get one Choices
     * const choices = await prisma.choices.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChoicesFindFirstOrThrowArgs>(args?: SelectSubset<T, ChoicesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Choices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Choices
     * const choices = await prisma.choices.findMany()
     * 
     * // Get first 10 Choices
     * const choices = await prisma.choices.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const choicesWithIdOnly = await prisma.choices.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChoicesFindManyArgs>(args?: SelectSubset<T, ChoicesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Choices.
     * @param {ChoicesCreateArgs} args - Arguments to create a Choices.
     * @example
     * // Create one Choices
     * const Choices = await prisma.choices.create({
     *   data: {
     *     // ... data to create a Choices
     *   }
     * })
     * 
     */
    create<T extends ChoicesCreateArgs>(args: SelectSubset<T, ChoicesCreateArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Choices.
     * @param {ChoicesCreateManyArgs} args - Arguments to create many Choices.
     * @example
     * // Create many Choices
     * const choices = await prisma.choices.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChoicesCreateManyArgs>(args?: SelectSubset<T, ChoicesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Choices and returns the data saved in the database.
     * @param {ChoicesCreateManyAndReturnArgs} args - Arguments to create many Choices.
     * @example
     * // Create many Choices
     * const choices = await prisma.choices.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Choices and only return the `id`
     * const choicesWithIdOnly = await prisma.choices.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChoicesCreateManyAndReturnArgs>(args?: SelectSubset<T, ChoicesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Choices.
     * @param {ChoicesDeleteArgs} args - Arguments to delete one Choices.
     * @example
     * // Delete one Choices
     * const Choices = await prisma.choices.delete({
     *   where: {
     *     // ... filter to delete one Choices
     *   }
     * })
     * 
     */
    delete<T extends ChoicesDeleteArgs>(args: SelectSubset<T, ChoicesDeleteArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Choices.
     * @param {ChoicesUpdateArgs} args - Arguments to update one Choices.
     * @example
     * // Update one Choices
     * const choices = await prisma.choices.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChoicesUpdateArgs>(args: SelectSubset<T, ChoicesUpdateArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Choices.
     * @param {ChoicesDeleteManyArgs} args - Arguments to filter Choices to delete.
     * @example
     * // Delete a few Choices
     * const { count } = await prisma.choices.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChoicesDeleteManyArgs>(args?: SelectSubset<T, ChoicesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Choices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Choices
     * const choices = await prisma.choices.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChoicesUpdateManyArgs>(args: SelectSubset<T, ChoicesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Choices and returns the data updated in the database.
     * @param {ChoicesUpdateManyAndReturnArgs} args - Arguments to update many Choices.
     * @example
     * // Update many Choices
     * const choices = await prisma.choices.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Choices and only return the `id`
     * const choicesWithIdOnly = await prisma.choices.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChoicesUpdateManyAndReturnArgs>(args: SelectSubset<T, ChoicesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Choices.
     * @param {ChoicesUpsertArgs} args - Arguments to update or create a Choices.
     * @example
     * // Update or create a Choices
     * const choices = await prisma.choices.upsert({
     *   create: {
     *     // ... data to create a Choices
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Choices we want to update
     *   }
     * })
     */
    upsert<T extends ChoicesUpsertArgs>(args: SelectSubset<T, ChoicesUpsertArgs<ExtArgs>>): Prisma__ChoicesClient<$Result.GetResult<Prisma.$ChoicesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Choices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesCountArgs} args - Arguments to filter Choices to count.
     * @example
     * // Count the number of Choices
     * const count = await prisma.choices.count({
     *   where: {
     *     // ... the filter for the Choices we want to count
     *   }
     * })
    **/
    count<T extends ChoicesCountArgs>(
      args?: Subset<T, ChoicesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChoicesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Choices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChoicesAggregateArgs>(args: Subset<T, ChoicesAggregateArgs>): Prisma.PrismaPromise<GetChoicesAggregateType<T>>

    /**
     * Group by Choices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChoicesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChoicesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChoicesGroupByArgs['orderBy'] }
        : { orderBy?: ChoicesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChoicesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChoicesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Choices model
   */
  readonly fields: ChoicesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Choices.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChoicesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    question<T extends QuestionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionsDefaultArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Choices model
   */
  interface ChoicesFieldRefs {
    readonly id: FieldRef<"Choices", 'String'>
    readonly wording: FieldRef<"Choices", 'String'>
    readonly questionId: FieldRef<"Choices", 'String'>
    readonly createdAt: FieldRef<"Choices", 'DateTime'>
    readonly updatedAt: FieldRef<"Choices", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Choices findUnique
   */
  export type ChoicesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter, which Choices to fetch.
     */
    where: ChoicesWhereUniqueInput
  }

  /**
   * Choices findUniqueOrThrow
   */
  export type ChoicesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter, which Choices to fetch.
     */
    where: ChoicesWhereUniqueInput
  }

  /**
   * Choices findFirst
   */
  export type ChoicesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter, which Choices to fetch.
     */
    where?: ChoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Choices to fetch.
     */
    orderBy?: ChoicesOrderByWithRelationInput | ChoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Choices.
     */
    cursor?: ChoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Choices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Choices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Choices.
     */
    distinct?: ChoicesScalarFieldEnum | ChoicesScalarFieldEnum[]
  }

  /**
   * Choices findFirstOrThrow
   */
  export type ChoicesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter, which Choices to fetch.
     */
    where?: ChoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Choices to fetch.
     */
    orderBy?: ChoicesOrderByWithRelationInput | ChoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Choices.
     */
    cursor?: ChoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Choices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Choices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Choices.
     */
    distinct?: ChoicesScalarFieldEnum | ChoicesScalarFieldEnum[]
  }

  /**
   * Choices findMany
   */
  export type ChoicesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter, which Choices to fetch.
     */
    where?: ChoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Choices to fetch.
     */
    orderBy?: ChoicesOrderByWithRelationInput | ChoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Choices.
     */
    cursor?: ChoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Choices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Choices.
     */
    skip?: number
    distinct?: ChoicesScalarFieldEnum | ChoicesScalarFieldEnum[]
  }

  /**
   * Choices create
   */
  export type ChoicesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * The data needed to create a Choices.
     */
    data: XOR<ChoicesCreateInput, ChoicesUncheckedCreateInput>
  }

  /**
   * Choices createMany
   */
  export type ChoicesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Choices.
     */
    data: ChoicesCreateManyInput | ChoicesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Choices createManyAndReturn
   */
  export type ChoicesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * The data used to create many Choices.
     */
    data: ChoicesCreateManyInput | ChoicesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Choices update
   */
  export type ChoicesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * The data needed to update a Choices.
     */
    data: XOR<ChoicesUpdateInput, ChoicesUncheckedUpdateInput>
    /**
     * Choose, which Choices to update.
     */
    where: ChoicesWhereUniqueInput
  }

  /**
   * Choices updateMany
   */
  export type ChoicesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Choices.
     */
    data: XOR<ChoicesUpdateManyMutationInput, ChoicesUncheckedUpdateManyInput>
    /**
     * Filter which Choices to update
     */
    where?: ChoicesWhereInput
    /**
     * Limit how many Choices to update.
     */
    limit?: number
  }

  /**
   * Choices updateManyAndReturn
   */
  export type ChoicesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * The data used to update Choices.
     */
    data: XOR<ChoicesUpdateManyMutationInput, ChoicesUncheckedUpdateManyInput>
    /**
     * Filter which Choices to update
     */
    where?: ChoicesWhereInput
    /**
     * Limit how many Choices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Choices upsert
   */
  export type ChoicesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * The filter to search for the Choices to update in case it exists.
     */
    where: ChoicesWhereUniqueInput
    /**
     * In case the Choices found by the `where` argument doesn't exist, create a new Choices with this data.
     */
    create: XOR<ChoicesCreateInput, ChoicesUncheckedCreateInput>
    /**
     * In case the Choices was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChoicesUpdateInput, ChoicesUncheckedUpdateInput>
  }

  /**
   * Choices delete
   */
  export type ChoicesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
    /**
     * Filter which Choices to delete.
     */
    where: ChoicesWhereUniqueInput
  }

  /**
   * Choices deleteMany
   */
  export type ChoicesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Choices to delete
     */
    where?: ChoicesWhereInput
    /**
     * Limit how many Choices to delete.
     */
    limit?: number
  }

  /**
   * Choices without action
   */
  export type ChoicesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Choices
     */
    select?: ChoicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Choices
     */
    omit?: ChoicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChoicesInclude<ExtArgs> | null
  }


  /**
   * Model Answers
   */

  export type AggregateAnswers = {
    _count: AnswersCountAggregateOutputType | null
    _min: AnswersMinAggregateOutputType | null
    _max: AnswersMaxAggregateOutputType | null
  }

  export type AnswersMinAggregateOutputType = {
    id: string | null
    uuid: string | null
    response: string | null
    questionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnswersMaxAggregateOutputType = {
    id: string | null
    uuid: string | null
    response: string | null
    questionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnswersCountAggregateOutputType = {
    id: number
    uuid: number
    response: number
    questionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnswersMinAggregateInputType = {
    id?: true
    uuid?: true
    response?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnswersMaxAggregateInputType = {
    id?: true
    uuid?: true
    response?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnswersCountAggregateInputType = {
    id?: true
    uuid?: true
    response?: true
    questionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnswersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Answers to aggregate.
     */
    where?: AnswersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswersOrderByWithRelationInput | AnswersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnswersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Answers
    **/
    _count?: true | AnswersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnswersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnswersMaxAggregateInputType
  }

  export type GetAnswersAggregateType<T extends AnswersAggregateArgs> = {
        [P in keyof T & keyof AggregateAnswers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnswers[P]>
      : GetScalarType<T[P], AggregateAnswers[P]>
  }




  export type AnswersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnswersWhereInput
    orderBy?: AnswersOrderByWithAggregationInput | AnswersOrderByWithAggregationInput[]
    by: AnswersScalarFieldEnum[] | AnswersScalarFieldEnum
    having?: AnswersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnswersCountAggregateInputType | true
    _min?: AnswersMinAggregateInputType
    _max?: AnswersMaxAggregateInputType
  }

  export type AnswersGroupByOutputType = {
    id: string
    uuid: string
    response: string
    questionId: string
    createdAt: Date
    updatedAt: Date
    _count: AnswersCountAggregateOutputType | null
    _min: AnswersMinAggregateOutputType | null
    _max: AnswersMaxAggregateOutputType | null
  }

  type GetAnswersGroupByPayload<T extends AnswersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnswersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnswersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnswersGroupByOutputType[P]>
            : GetScalarType<T[P], AnswersGroupByOutputType[P]>
        }
      >
    >


  export type AnswersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    response?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answers"]>

  export type AnswersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    response?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answers"]>

  export type AnswersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    response?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["answers"]>

  export type AnswersSelectScalar = {
    id?: boolean
    uuid?: boolean
    response?: boolean
    questionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnswersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "response" | "questionId" | "createdAt" | "updatedAt", ExtArgs["result"]["answers"]>
  export type AnswersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }
  export type AnswersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }
  export type AnswersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    question?: boolean | QuestionsDefaultArgs<ExtArgs>
  }

  export type $AnswersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Answers"
    objects: {
      question: Prisma.$QuestionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      uuid: string
      response: string
      questionId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["answers"]>
    composites: {}
  }

  type AnswersGetPayload<S extends boolean | null | undefined | AnswersDefaultArgs> = $Result.GetResult<Prisma.$AnswersPayload, S>

  type AnswersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnswersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnswersCountAggregateInputType | true
    }

  export interface AnswersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Answers'], meta: { name: 'Answers' } }
    /**
     * Find zero or one Answers that matches the filter.
     * @param {AnswersFindUniqueArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnswersFindUniqueArgs>(args: SelectSubset<T, AnswersFindUniqueArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Answers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnswersFindUniqueOrThrowArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnswersFindUniqueOrThrowArgs>(args: SelectSubset<T, AnswersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersFindFirstArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnswersFindFirstArgs>(args?: SelectSubset<T, AnswersFindFirstArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Answers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersFindFirstOrThrowArgs} args - Arguments to find a Answers
     * @example
     * // Get one Answers
     * const answers = await prisma.answers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnswersFindFirstOrThrowArgs>(args?: SelectSubset<T, AnswersFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Answers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Answers
     * const answers = await prisma.answers.findMany()
     * 
     * // Get first 10 Answers
     * const answers = await prisma.answers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const answersWithIdOnly = await prisma.answers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnswersFindManyArgs>(args?: SelectSubset<T, AnswersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Answers.
     * @param {AnswersCreateArgs} args - Arguments to create a Answers.
     * @example
     * // Create one Answers
     * const Answers = await prisma.answers.create({
     *   data: {
     *     // ... data to create a Answers
     *   }
     * })
     * 
     */
    create<T extends AnswersCreateArgs>(args: SelectSubset<T, AnswersCreateArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Answers.
     * @param {AnswersCreateManyArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answers = await prisma.answers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnswersCreateManyArgs>(args?: SelectSubset<T, AnswersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Answers and returns the data saved in the database.
     * @param {AnswersCreateManyAndReturnArgs} args - Arguments to create many Answers.
     * @example
     * // Create many Answers
     * const answers = await prisma.answers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Answers and only return the `id`
     * const answersWithIdOnly = await prisma.answers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnswersCreateManyAndReturnArgs>(args?: SelectSubset<T, AnswersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Answers.
     * @param {AnswersDeleteArgs} args - Arguments to delete one Answers.
     * @example
     * // Delete one Answers
     * const Answers = await prisma.answers.delete({
     *   where: {
     *     // ... filter to delete one Answers
     *   }
     * })
     * 
     */
    delete<T extends AnswersDeleteArgs>(args: SelectSubset<T, AnswersDeleteArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Answers.
     * @param {AnswersUpdateArgs} args - Arguments to update one Answers.
     * @example
     * // Update one Answers
     * const answers = await prisma.answers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnswersUpdateArgs>(args: SelectSubset<T, AnswersUpdateArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Answers.
     * @param {AnswersDeleteManyArgs} args - Arguments to filter Answers to delete.
     * @example
     * // Delete a few Answers
     * const { count } = await prisma.answers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnswersDeleteManyArgs>(args?: SelectSubset<T, AnswersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Answers
     * const answers = await prisma.answers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnswersUpdateManyArgs>(args: SelectSubset<T, AnswersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Answers and returns the data updated in the database.
     * @param {AnswersUpdateManyAndReturnArgs} args - Arguments to update many Answers.
     * @example
     * // Update many Answers
     * const answers = await prisma.answers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Answers and only return the `id`
     * const answersWithIdOnly = await prisma.answers.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnswersUpdateManyAndReturnArgs>(args: SelectSubset<T, AnswersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Answers.
     * @param {AnswersUpsertArgs} args - Arguments to update or create a Answers.
     * @example
     * // Update or create a Answers
     * const answers = await prisma.answers.upsert({
     *   create: {
     *     // ... data to create a Answers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Answers we want to update
     *   }
     * })
     */
    upsert<T extends AnswersUpsertArgs>(args: SelectSubset<T, AnswersUpsertArgs<ExtArgs>>): Prisma__AnswersClient<$Result.GetResult<Prisma.$AnswersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersCountArgs} args - Arguments to filter Answers to count.
     * @example
     * // Count the number of Answers
     * const count = await prisma.answers.count({
     *   where: {
     *     // ... the filter for the Answers we want to count
     *   }
     * })
    **/
    count<T extends AnswersCountArgs>(
      args?: Subset<T, AnswersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnswersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnswersAggregateArgs>(args: Subset<T, AnswersAggregateArgs>): Prisma.PrismaPromise<GetAnswersAggregateType<T>>

    /**
     * Group by Answers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnswersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnswersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnswersGroupByArgs['orderBy'] }
        : { orderBy?: AnswersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnswersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnswersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Answers model
   */
  readonly fields: AnswersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Answers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnswersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    question<T extends QuestionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionsDefaultArgs<ExtArgs>>): Prisma__QuestionsClient<$Result.GetResult<Prisma.$QuestionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Answers model
   */
  interface AnswersFieldRefs {
    readonly id: FieldRef<"Answers", 'String'>
    readonly uuid: FieldRef<"Answers", 'String'>
    readonly response: FieldRef<"Answers", 'String'>
    readonly questionId: FieldRef<"Answers", 'String'>
    readonly createdAt: FieldRef<"Answers", 'DateTime'>
    readonly updatedAt: FieldRef<"Answers", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Answers findUnique
   */
  export type AnswersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where: AnswersWhereUniqueInput
  }

  /**
   * Answers findUniqueOrThrow
   */
  export type AnswersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where: AnswersWhereUniqueInput
  }

  /**
   * Answers findFirst
   */
  export type AnswersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where?: AnswersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswersOrderByWithRelationInput | AnswersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Answers.
     */
    cursor?: AnswersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Answers.
     */
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * Answers findFirstOrThrow
   */
  export type AnswersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where?: AnswersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswersOrderByWithRelationInput | AnswersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Answers.
     */
    cursor?: AnswersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Answers.
     */
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * Answers findMany
   */
  export type AnswersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter, which Answers to fetch.
     */
    where?: AnswersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Answers to fetch.
     */
    orderBy?: AnswersOrderByWithRelationInput | AnswersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Answers.
     */
    cursor?: AnswersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Answers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Answers.
     */
    skip?: number
    distinct?: AnswersScalarFieldEnum | AnswersScalarFieldEnum[]
  }

  /**
   * Answers create
   */
  export type AnswersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * The data needed to create a Answers.
     */
    data: XOR<AnswersCreateInput, AnswersUncheckedCreateInput>
  }

  /**
   * Answers createMany
   */
  export type AnswersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Answers.
     */
    data: AnswersCreateManyInput | AnswersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Answers createManyAndReturn
   */
  export type AnswersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * The data used to create many Answers.
     */
    data: AnswersCreateManyInput | AnswersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Answers update
   */
  export type AnswersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * The data needed to update a Answers.
     */
    data: XOR<AnswersUpdateInput, AnswersUncheckedUpdateInput>
    /**
     * Choose, which Answers to update.
     */
    where: AnswersWhereUniqueInput
  }

  /**
   * Answers updateMany
   */
  export type AnswersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Answers.
     */
    data: XOR<AnswersUpdateManyMutationInput, AnswersUncheckedUpdateManyInput>
    /**
     * Filter which Answers to update
     */
    where?: AnswersWhereInput
    /**
     * Limit how many Answers to update.
     */
    limit?: number
  }

  /**
   * Answers updateManyAndReturn
   */
  export type AnswersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * The data used to update Answers.
     */
    data: XOR<AnswersUpdateManyMutationInput, AnswersUncheckedUpdateManyInput>
    /**
     * Filter which Answers to update
     */
    where?: AnswersWhereInput
    /**
     * Limit how many Answers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Answers upsert
   */
  export type AnswersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * The filter to search for the Answers to update in case it exists.
     */
    where: AnswersWhereUniqueInput
    /**
     * In case the Answers found by the `where` argument doesn't exist, create a new Answers with this data.
     */
    create: XOR<AnswersCreateInput, AnswersUncheckedCreateInput>
    /**
     * In case the Answers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnswersUpdateInput, AnswersUncheckedUpdateInput>
  }

  /**
   * Answers delete
   */
  export type AnswersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
    /**
     * Filter which Answers to delete.
     */
    where: AnswersWhereUniqueInput
  }

  /**
   * Answers deleteMany
   */
  export type AnswersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Answers to delete
     */
    where?: AnswersWhereInput
    /**
     * Limit how many Answers to delete.
     */
    limit?: number
  }

  /**
   * Answers without action
   */
  export type AnswersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Answers
     */
    select?: AnswersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Answers
     */
    omit?: AnswersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnswersInclude<ExtArgs> | null
  }


  /**
   * Model Users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    active: boolean | null
    firstname: string | null
    lastname: string | null
    phone: string | null
    lastLoging: Date | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: string | null
    active: boolean | null
    firstname: string | null
    lastname: string | null
    phone: string | null
    lastLoging: Date | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    active: number
    firstname: number
    lastname: number
    phone: number
    lastLoging: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    active?: true
    firstname?: true
    lastname?: true
    phone?: true
    lastLoging?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    active?: true
    firstname?: true
    lastname?: true
    phone?: true
    lastLoging?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    active?: true
    firstname?: true
    lastname?: true
    phone?: true
    lastLoging?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to aggregate.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsersWhereInput
    orderBy?: UsersOrderByWithAggregationInput | UsersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: UsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    email: string
    password: string
    role: string
    active: boolean
    firstname: string
    lastname: string
    phone: string | null
    lastLoging: Date | null
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type UsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    active?: boolean
    firstname?: boolean
    lastname?: boolean
    phone?: boolean
    lastLoging?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    active?: boolean
    firstname?: boolean
    lastname?: boolean
    phone?: boolean
    lastLoging?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    active?: boolean
    firstname?: boolean
    lastname?: boolean
    phone?: boolean
    lastLoging?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["users"]>

  export type UsersSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    active?: boolean
    firstname?: boolean
    lastname?: boolean
    phone?: boolean
    lastLoging?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "active" | "firstname" | "lastname" | "phone" | "lastLoging" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["users"]>

  export type $UsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Users"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      role: string
      active: boolean
      firstname: string
      lastname: string
      phone: string | null
      lastLoging: Date | null
      createdBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = $Result.GetResult<Prisma.$UsersPayload, S>

  type UsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface UsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Users'], meta: { name: 'Users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {UsersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsersFindUniqueArgs>(args: SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsersFindFirstArgs>(args?: SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsersFindManyArgs>(args?: SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {UsersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends UsersCreateArgs>(args: SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UsersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsersCreateManyArgs>(args?: SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UsersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsersCreateManyAndReturnArgs>(args?: SelectSubset<T, UsersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {UsersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends UsersDeleteArgs>(args: SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {UsersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsersUpdateArgs>(args: SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UsersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsersDeleteManyArgs>(args?: SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsersUpdateManyArgs>(args: SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UsersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsersUpdateManyAndReturnArgs>(args: SelectSubset<T, UsersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {UsersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends UsersUpsertArgs>(args: SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UsersCountArgs>(
      args?: Subset<T, UsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Users model
   */
  readonly fields: UsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Users model
   */
  interface UsersFieldRefs {
    readonly id: FieldRef<"Users", 'String'>
    readonly email: FieldRef<"Users", 'String'>
    readonly password: FieldRef<"Users", 'String'>
    readonly role: FieldRef<"Users", 'String'>
    readonly active: FieldRef<"Users", 'Boolean'>
    readonly firstname: FieldRef<"Users", 'String'>
    readonly lastname: FieldRef<"Users", 'String'>
    readonly phone: FieldRef<"Users", 'String'>
    readonly lastLoging: FieldRef<"Users", 'DateTime'>
    readonly createdBy: FieldRef<"Users", 'String'>
    readonly createdAt: FieldRef<"Users", 'DateTime'>
    readonly updatedAt: FieldRef<"Users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Users findUnique
   */
  export type UsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findUniqueOrThrow
   */
  export type UsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findFirst
   */
  export type UsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findFirstOrThrow
   */
  export type UsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findMany
   */
  export type UsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users create
   */
  export type UsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data needed to create a Users.
     */
    data: XOR<UsersCreateInput, UsersUncheckedCreateInput>
  }

  /**
   * Users createMany
   */
  export type UsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users createManyAndReturn
   */
  export type UsersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users update
   */
  export type UsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data needed to update a Users.
     */
    data: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
    /**
     * Choose, which Users to update.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users updateMany
   */
  export type UsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users updateManyAndReturn
   */
  export type UsersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users upsert
   */
  export type UsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * The filter to search for the Users to update in case it exists.
     */
    where: UsersWhereUniqueInput
    /**
     * In case the Users found by the `where` argument doesn't exist, create a new Users with this data.
     */
    create: XOR<UsersCreateInput, UsersUncheckedCreateInput>
    /**
     * In case the Users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
  }

  /**
   * Users delete
   */
  export type UsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Filter which Users to delete.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users deleteMany
   */
  export type UsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * Users without action
   */
  export type UsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SitesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    type: 'type',
    capacity: 'capacity',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SitesScalarFieldEnum = (typeof SitesScalarFieldEnum)[keyof typeof SitesScalarFieldEnum]


  export const AmenitiesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    siteId: 'siteId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AmenitiesScalarFieldEnum = (typeof AmenitiesScalarFieldEnum)[keyof typeof AmenitiesScalarFieldEnum]


  export const EventsTypesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventsTypesScalarFieldEnum = (typeof EventsTypesScalarFieldEnum)[keyof typeof EventsTypesScalarFieldEnum]


  export const EventsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    status: 'status',
    siteId: 'siteId',
    eventTypeId: 'eventTypeId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventsScalarFieldEnum = (typeof EventsScalarFieldEnum)[keyof typeof EventsScalarFieldEnum]


  export const ProgramsScalarFieldEnum: {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    eventId: 'eventId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgramsScalarFieldEnum = (typeof ProgramsScalarFieldEnum)[keyof typeof ProgramsScalarFieldEnum]


  export const ArtistsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    eventId: 'eventId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArtistsScalarFieldEnum = (typeof ArtistsScalarFieldEnum)[keyof typeof ArtistsScalarFieldEnum]


  export const QuizScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    active: 'active',
    eventId: 'eventId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuizScalarFieldEnum = (typeof QuizScalarFieldEnum)[keyof typeof QuizScalarFieldEnum]


  export const QuestionsTypesScalarFieldEnum: {
    id: 'id',
    types: 'types',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuestionsTypesScalarFieldEnum = (typeof QuestionsTypesScalarFieldEnum)[keyof typeof QuestionsTypesScalarFieldEnum]


  export const QuestionsScalarFieldEnum: {
    id: 'id',
    wording: 'wording',
    questionTypeId: 'questionTypeId',
    quizId: 'quizId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuestionsScalarFieldEnum = (typeof QuestionsScalarFieldEnum)[keyof typeof QuestionsScalarFieldEnum]


  export const ImpressionsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    emoji: 'emoji',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImpressionsScalarFieldEnum = (typeof ImpressionsScalarFieldEnum)[keyof typeof ImpressionsScalarFieldEnum]


  export const Questions_impressionsScalarFieldEnum: {
    questionId: 'questionId',
    impressionId: 'impressionId'
  };

  export type Questions_impressionsScalarFieldEnum = (typeof Questions_impressionsScalarFieldEnum)[keyof typeof Questions_impressionsScalarFieldEnum]


  export const ChoicesScalarFieldEnum: {
    id: 'id',
    wording: 'wording',
    questionId: 'questionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChoicesScalarFieldEnum = (typeof ChoicesScalarFieldEnum)[keyof typeof ChoicesScalarFieldEnum]


  export const AnswersScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    response: 'response',
    questionId: 'questionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnswersScalarFieldEnum = (typeof AnswersScalarFieldEnum)[keyof typeof AnswersScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    active: 'active',
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    lastLoging: 'lastLoging',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type SitesWhereInput = {
    AND?: SitesWhereInput | SitesWhereInput[]
    OR?: SitesWhereInput[]
    NOT?: SitesWhereInput | SitesWhereInput[]
    id?: StringFilter<"Sites"> | string
    name?: StringFilter<"Sites"> | string
    description?: StringNullableFilter<"Sites"> | string | null
    latitude?: FloatFilter<"Sites"> | number
    longitude?: FloatFilter<"Sites"> | number
    type?: StringFilter<"Sites"> | string
    capacity?: IntFilter<"Sites"> | number
    createdAt?: DateTimeFilter<"Sites"> | Date | string
    updatedAt?: DateTimeFilter<"Sites"> | Date | string
    amenities?: AmenitiesListRelationFilter
    events?: EventsListRelationFilter
  }

  export type SitesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    amenities?: AmenitiesOrderByRelationAggregateInput
    events?: EventsOrderByRelationAggregateInput
  }

  export type SitesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SitesWhereInput | SitesWhereInput[]
    OR?: SitesWhereInput[]
    NOT?: SitesWhereInput | SitesWhereInput[]
    name?: StringFilter<"Sites"> | string
    description?: StringNullableFilter<"Sites"> | string | null
    latitude?: FloatFilter<"Sites"> | number
    longitude?: FloatFilter<"Sites"> | number
    type?: StringFilter<"Sites"> | string
    capacity?: IntFilter<"Sites"> | number
    createdAt?: DateTimeFilter<"Sites"> | Date | string
    updatedAt?: DateTimeFilter<"Sites"> | Date | string
    amenities?: AmenitiesListRelationFilter
    events?: EventsListRelationFilter
  }, "id">

  export type SitesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SitesCountOrderByAggregateInput
    _avg?: SitesAvgOrderByAggregateInput
    _max?: SitesMaxOrderByAggregateInput
    _min?: SitesMinOrderByAggregateInput
    _sum?: SitesSumOrderByAggregateInput
  }

  export type SitesScalarWhereWithAggregatesInput = {
    AND?: SitesScalarWhereWithAggregatesInput | SitesScalarWhereWithAggregatesInput[]
    OR?: SitesScalarWhereWithAggregatesInput[]
    NOT?: SitesScalarWhereWithAggregatesInput | SitesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sites"> | string
    name?: StringWithAggregatesFilter<"Sites"> | string
    description?: StringNullableWithAggregatesFilter<"Sites"> | string | null
    latitude?: FloatWithAggregatesFilter<"Sites"> | number
    longitude?: FloatWithAggregatesFilter<"Sites"> | number
    type?: StringWithAggregatesFilter<"Sites"> | string
    capacity?: IntWithAggregatesFilter<"Sites"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Sites"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Sites"> | Date | string
  }

  export type AmenitiesWhereInput = {
    AND?: AmenitiesWhereInput | AmenitiesWhereInput[]
    OR?: AmenitiesWhereInput[]
    NOT?: AmenitiesWhereInput | AmenitiesWhereInput[]
    id?: StringFilter<"Amenities"> | string
    name?: StringFilter<"Amenities"> | string
    siteId?: StringFilter<"Amenities"> | string
    createdAt?: DateTimeFilter<"Amenities"> | Date | string
    updatedAt?: DateTimeFilter<"Amenities"> | Date | string
    site?: XOR<SitesScalarRelationFilter, SitesWhereInput>
  }

  export type AmenitiesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    siteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    site?: SitesOrderByWithRelationInput
  }

  export type AmenitiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmenitiesWhereInput | AmenitiesWhereInput[]
    OR?: AmenitiesWhereInput[]
    NOT?: AmenitiesWhereInput | AmenitiesWhereInput[]
    name?: StringFilter<"Amenities"> | string
    siteId?: StringFilter<"Amenities"> | string
    createdAt?: DateTimeFilter<"Amenities"> | Date | string
    updatedAt?: DateTimeFilter<"Amenities"> | Date | string
    site?: XOR<SitesScalarRelationFilter, SitesWhereInput>
  }, "id">

  export type AmenitiesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    siteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AmenitiesCountOrderByAggregateInput
    _max?: AmenitiesMaxOrderByAggregateInput
    _min?: AmenitiesMinOrderByAggregateInput
  }

  export type AmenitiesScalarWhereWithAggregatesInput = {
    AND?: AmenitiesScalarWhereWithAggregatesInput | AmenitiesScalarWhereWithAggregatesInput[]
    OR?: AmenitiesScalarWhereWithAggregatesInput[]
    NOT?: AmenitiesScalarWhereWithAggregatesInput | AmenitiesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Amenities"> | string
    name?: StringWithAggregatesFilter<"Amenities"> | string
    siteId?: StringWithAggregatesFilter<"Amenities"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Amenities"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Amenities"> | Date | string
  }

  export type EventsTypesWhereInput = {
    AND?: EventsTypesWhereInput | EventsTypesWhereInput[]
    OR?: EventsTypesWhereInput[]
    NOT?: EventsTypesWhereInput | EventsTypesWhereInput[]
    id?: StringFilter<"EventsTypes"> | string
    name?: StringFilter<"EventsTypes"> | string
    createdAt?: DateTimeFilter<"EventsTypes"> | Date | string
    updatedAt?: DateTimeFilter<"EventsTypes"> | Date | string
    events?: EventsListRelationFilter
  }

  export type EventsTypesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    events?: EventsOrderByRelationAggregateInput
  }

  export type EventsTypesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventsTypesWhereInput | EventsTypesWhereInput[]
    OR?: EventsTypesWhereInput[]
    NOT?: EventsTypesWhereInput | EventsTypesWhereInput[]
    name?: StringFilter<"EventsTypes"> | string
    createdAt?: DateTimeFilter<"EventsTypes"> | Date | string
    updatedAt?: DateTimeFilter<"EventsTypes"> | Date | string
    events?: EventsListRelationFilter
  }, "id">

  export type EventsTypesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventsTypesCountOrderByAggregateInput
    _max?: EventsTypesMaxOrderByAggregateInput
    _min?: EventsTypesMinOrderByAggregateInput
  }

  export type EventsTypesScalarWhereWithAggregatesInput = {
    AND?: EventsTypesScalarWhereWithAggregatesInput | EventsTypesScalarWhereWithAggregatesInput[]
    OR?: EventsTypesScalarWhereWithAggregatesInput[]
    NOT?: EventsTypesScalarWhereWithAggregatesInput | EventsTypesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventsTypes"> | string
    name?: StringWithAggregatesFilter<"EventsTypes"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EventsTypes"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EventsTypes"> | Date | string
  }

  export type EventsWhereInput = {
    AND?: EventsWhereInput | EventsWhereInput[]
    OR?: EventsWhereInput[]
    NOT?: EventsWhereInput | EventsWhereInput[]
    id?: StringFilter<"Events"> | string
    name?: StringFilter<"Events"> | string
    description?: StringNullableFilter<"Events"> | string | null
    status?: StringFilter<"Events"> | string
    siteId?: StringFilter<"Events"> | string
    eventTypeId?: StringFilter<"Events"> | string
    createdBy?: StringFilter<"Events"> | string
    createdAt?: DateTimeFilter<"Events"> | Date | string
    updatedAt?: DateTimeFilter<"Events"> | Date | string
    site?: XOR<SitesScalarRelationFilter, SitesWhereInput>
    eventType?: XOR<EventsTypesScalarRelationFilter, EventsTypesWhereInput>
    programs?: ProgramsListRelationFilter
    artists?: ArtistsListRelationFilter
    quizzes?: QuizListRelationFilter
  }

  export type EventsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    siteId?: SortOrder
    eventTypeId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    site?: SitesOrderByWithRelationInput
    eventType?: EventsTypesOrderByWithRelationInput
    programs?: ProgramsOrderByRelationAggregateInput
    artists?: ArtistsOrderByRelationAggregateInput
    quizzes?: QuizOrderByRelationAggregateInput
  }

  export type EventsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventsWhereInput | EventsWhereInput[]
    OR?: EventsWhereInput[]
    NOT?: EventsWhereInput | EventsWhereInput[]
    name?: StringFilter<"Events"> | string
    description?: StringNullableFilter<"Events"> | string | null
    status?: StringFilter<"Events"> | string
    siteId?: StringFilter<"Events"> | string
    eventTypeId?: StringFilter<"Events"> | string
    createdBy?: StringFilter<"Events"> | string
    createdAt?: DateTimeFilter<"Events"> | Date | string
    updatedAt?: DateTimeFilter<"Events"> | Date | string
    site?: XOR<SitesScalarRelationFilter, SitesWhereInput>
    eventType?: XOR<EventsTypesScalarRelationFilter, EventsTypesWhereInput>
    programs?: ProgramsListRelationFilter
    artists?: ArtistsListRelationFilter
    quizzes?: QuizListRelationFilter
  }, "id">

  export type EventsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    siteId?: SortOrder
    eventTypeId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventsCountOrderByAggregateInput
    _max?: EventsMaxOrderByAggregateInput
    _min?: EventsMinOrderByAggregateInput
  }

  export type EventsScalarWhereWithAggregatesInput = {
    AND?: EventsScalarWhereWithAggregatesInput | EventsScalarWhereWithAggregatesInput[]
    OR?: EventsScalarWhereWithAggregatesInput[]
    NOT?: EventsScalarWhereWithAggregatesInput | EventsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Events"> | string
    name?: StringWithAggregatesFilter<"Events"> | string
    description?: StringNullableWithAggregatesFilter<"Events"> | string | null
    status?: StringWithAggregatesFilter<"Events"> | string
    siteId?: StringWithAggregatesFilter<"Events"> | string
    eventTypeId?: StringWithAggregatesFilter<"Events"> | string
    createdBy?: StringWithAggregatesFilter<"Events"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Events"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Events"> | Date | string
  }

  export type ProgramsWhereInput = {
    AND?: ProgramsWhereInput | ProgramsWhereInput[]
    OR?: ProgramsWhereInput[]
    NOT?: ProgramsWhereInput | ProgramsWhereInput[]
    id?: StringFilter<"Programs"> | string
    startTime?: DateTimeFilter<"Programs"> | Date | string
    endTime?: DateTimeFilter<"Programs"> | Date | string
    eventId?: StringFilter<"Programs"> | string
    createdAt?: DateTimeFilter<"Programs"> | Date | string
    updatedAt?: DateTimeFilter<"Programs"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
  }

  export type ProgramsOrderByWithRelationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventsOrderByWithRelationInput
  }

  export type ProgramsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgramsWhereInput | ProgramsWhereInput[]
    OR?: ProgramsWhereInput[]
    NOT?: ProgramsWhereInput | ProgramsWhereInput[]
    startTime?: DateTimeFilter<"Programs"> | Date | string
    endTime?: DateTimeFilter<"Programs"> | Date | string
    eventId?: StringFilter<"Programs"> | string
    createdAt?: DateTimeFilter<"Programs"> | Date | string
    updatedAt?: DateTimeFilter<"Programs"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
  }, "id">

  export type ProgramsOrderByWithAggregationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgramsCountOrderByAggregateInput
    _max?: ProgramsMaxOrderByAggregateInput
    _min?: ProgramsMinOrderByAggregateInput
  }

  export type ProgramsScalarWhereWithAggregatesInput = {
    AND?: ProgramsScalarWhereWithAggregatesInput | ProgramsScalarWhereWithAggregatesInput[]
    OR?: ProgramsScalarWhereWithAggregatesInput[]
    NOT?: ProgramsScalarWhereWithAggregatesInput | ProgramsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Programs"> | string
    startTime?: DateTimeWithAggregatesFilter<"Programs"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Programs"> | Date | string
    eventId?: StringWithAggregatesFilter<"Programs"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Programs"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Programs"> | Date | string
  }

  export type ArtistsWhereInput = {
    AND?: ArtistsWhereInput | ArtistsWhereInput[]
    OR?: ArtistsWhereInput[]
    NOT?: ArtistsWhereInput | ArtistsWhereInput[]
    id?: StringFilter<"Artists"> | string
    name?: StringFilter<"Artists"> | string
    eventId?: StringFilter<"Artists"> | string
    createdAt?: DateTimeFilter<"Artists"> | Date | string
    updatedAt?: DateTimeFilter<"Artists"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
  }

  export type ArtistsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventsOrderByWithRelationInput
  }

  export type ArtistsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArtistsWhereInput | ArtistsWhereInput[]
    OR?: ArtistsWhereInput[]
    NOT?: ArtistsWhereInput | ArtistsWhereInput[]
    name?: StringFilter<"Artists"> | string
    eventId?: StringFilter<"Artists"> | string
    createdAt?: DateTimeFilter<"Artists"> | Date | string
    updatedAt?: DateTimeFilter<"Artists"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
  }, "id">

  export type ArtistsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArtistsCountOrderByAggregateInput
    _max?: ArtistsMaxOrderByAggregateInput
    _min?: ArtistsMinOrderByAggregateInput
  }

  export type ArtistsScalarWhereWithAggregatesInput = {
    AND?: ArtistsScalarWhereWithAggregatesInput | ArtistsScalarWhereWithAggregatesInput[]
    OR?: ArtistsScalarWhereWithAggregatesInput[]
    NOT?: ArtistsScalarWhereWithAggregatesInput | ArtistsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Artists"> | string
    name?: StringWithAggregatesFilter<"Artists"> | string
    eventId?: StringWithAggregatesFilter<"Artists"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Artists"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Artists"> | Date | string
  }

  export type QuizWhereInput = {
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    id?: StringFilter<"Quiz"> | string
    title?: StringFilter<"Quiz"> | string
    description?: StringNullableFilter<"Quiz"> | string | null
    active?: BoolFilter<"Quiz"> | boolean
    eventId?: StringFilter<"Quiz"> | string
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
    questions?: QuestionsListRelationFilter
  }

  export type QuizOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventsOrderByWithRelationInput
    questions?: QuestionsOrderByRelationAggregateInput
  }

  export type QuizWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    title?: StringFilter<"Quiz"> | string
    description?: StringNullableFilter<"Quiz"> | string | null
    active?: BoolFilter<"Quiz"> | boolean
    eventId?: StringFilter<"Quiz"> | string
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    event?: XOR<EventsScalarRelationFilter, EventsWhereInput>
    questions?: QuestionsListRelationFilter
  }, "id">

  export type QuizOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuizCountOrderByAggregateInput
    _max?: QuizMaxOrderByAggregateInput
    _min?: QuizMinOrderByAggregateInput
  }

  export type QuizScalarWhereWithAggregatesInput = {
    AND?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    OR?: QuizScalarWhereWithAggregatesInput[]
    NOT?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quiz"> | string
    title?: StringWithAggregatesFilter<"Quiz"> | string
    description?: StringNullableWithAggregatesFilter<"Quiz"> | string | null
    active?: BoolWithAggregatesFilter<"Quiz"> | boolean
    eventId?: StringWithAggregatesFilter<"Quiz"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
  }

  export type QuestionsTypesWhereInput = {
    AND?: QuestionsTypesWhereInput | QuestionsTypesWhereInput[]
    OR?: QuestionsTypesWhereInput[]
    NOT?: QuestionsTypesWhereInput | QuestionsTypesWhereInput[]
    id?: StringFilter<"QuestionsTypes"> | string
    types?: StringFilter<"QuestionsTypes"> | string
    createdAt?: DateTimeFilter<"QuestionsTypes"> | Date | string
    updatedAt?: DateTimeFilter<"QuestionsTypes"> | Date | string
    questions?: QuestionsListRelationFilter
  }

  export type QuestionsTypesOrderByWithRelationInput = {
    id?: SortOrder
    types?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    questions?: QuestionsOrderByRelationAggregateInput
  }

  export type QuestionsTypesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionsTypesWhereInput | QuestionsTypesWhereInput[]
    OR?: QuestionsTypesWhereInput[]
    NOT?: QuestionsTypesWhereInput | QuestionsTypesWhereInput[]
    types?: StringFilter<"QuestionsTypes"> | string
    createdAt?: DateTimeFilter<"QuestionsTypes"> | Date | string
    updatedAt?: DateTimeFilter<"QuestionsTypes"> | Date | string
    questions?: QuestionsListRelationFilter
  }, "id">

  export type QuestionsTypesOrderByWithAggregationInput = {
    id?: SortOrder
    types?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuestionsTypesCountOrderByAggregateInput
    _max?: QuestionsTypesMaxOrderByAggregateInput
    _min?: QuestionsTypesMinOrderByAggregateInput
  }

  export type QuestionsTypesScalarWhereWithAggregatesInput = {
    AND?: QuestionsTypesScalarWhereWithAggregatesInput | QuestionsTypesScalarWhereWithAggregatesInput[]
    OR?: QuestionsTypesScalarWhereWithAggregatesInput[]
    NOT?: QuestionsTypesScalarWhereWithAggregatesInput | QuestionsTypesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuestionsTypes"> | string
    types?: StringWithAggregatesFilter<"QuestionsTypes"> | string
    createdAt?: DateTimeWithAggregatesFilter<"QuestionsTypes"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QuestionsTypes"> | Date | string
  }

  export type QuestionsWhereInput = {
    AND?: QuestionsWhereInput | QuestionsWhereInput[]
    OR?: QuestionsWhereInput[]
    NOT?: QuestionsWhereInput | QuestionsWhereInput[]
    id?: StringFilter<"Questions"> | string
    wording?: StringFilter<"Questions"> | string
    questionTypeId?: StringFilter<"Questions"> | string
    quizId?: StringFilter<"Questions"> | string
    createdAt?: DateTimeFilter<"Questions"> | Date | string
    updatedAt?: DateTimeFilter<"Questions"> | Date | string
    questionType?: XOR<QuestionsTypesScalarRelationFilter, QuestionsTypesWhereInput>
    quiz?: XOR<QuizScalarRelationFilter, QuizWhereInput>
    impressions?: Questions_impressionsListRelationFilter
    choices?: ChoicesListRelationFilter
    answers?: AnswersListRelationFilter
  }

  export type QuestionsOrderByWithRelationInput = {
    id?: SortOrder
    wording?: SortOrder
    questionTypeId?: SortOrder
    quizId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    questionType?: QuestionsTypesOrderByWithRelationInput
    quiz?: QuizOrderByWithRelationInput
    impressions?: Questions_impressionsOrderByRelationAggregateInput
    choices?: ChoicesOrderByRelationAggregateInput
    answers?: AnswersOrderByRelationAggregateInput
  }

  export type QuestionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionsWhereInput | QuestionsWhereInput[]
    OR?: QuestionsWhereInput[]
    NOT?: QuestionsWhereInput | QuestionsWhereInput[]
    wording?: StringFilter<"Questions"> | string
    questionTypeId?: StringFilter<"Questions"> | string
    quizId?: StringFilter<"Questions"> | string
    createdAt?: DateTimeFilter<"Questions"> | Date | string
    updatedAt?: DateTimeFilter<"Questions"> | Date | string
    questionType?: XOR<QuestionsTypesScalarRelationFilter, QuestionsTypesWhereInput>
    quiz?: XOR<QuizScalarRelationFilter, QuizWhereInput>
    impressions?: Questions_impressionsListRelationFilter
    choices?: ChoicesListRelationFilter
    answers?: AnswersListRelationFilter
  }, "id">

  export type QuestionsOrderByWithAggregationInput = {
    id?: SortOrder
    wording?: SortOrder
    questionTypeId?: SortOrder
    quizId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuestionsCountOrderByAggregateInput
    _max?: QuestionsMaxOrderByAggregateInput
    _min?: QuestionsMinOrderByAggregateInput
  }

  export type QuestionsScalarWhereWithAggregatesInput = {
    AND?: QuestionsScalarWhereWithAggregatesInput | QuestionsScalarWhereWithAggregatesInput[]
    OR?: QuestionsScalarWhereWithAggregatesInput[]
    NOT?: QuestionsScalarWhereWithAggregatesInput | QuestionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Questions"> | string
    wording?: StringWithAggregatesFilter<"Questions"> | string
    questionTypeId?: StringWithAggregatesFilter<"Questions"> | string
    quizId?: StringWithAggregatesFilter<"Questions"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Questions"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Questions"> | Date | string
  }

  export type ImpressionsWhereInput = {
    AND?: ImpressionsWhereInput | ImpressionsWhereInput[]
    OR?: ImpressionsWhereInput[]
    NOT?: ImpressionsWhereInput | ImpressionsWhereInput[]
    id?: StringFilter<"Impressions"> | string
    name?: StringFilter<"Impressions"> | string
    emoji?: StringFilter<"Impressions"> | string
    createdAt?: DateTimeFilter<"Impressions"> | Date | string
    updatedAt?: DateTimeFilter<"Impressions"> | Date | string
    questions?: Questions_impressionsListRelationFilter
  }

  export type ImpressionsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    questions?: Questions_impressionsOrderByRelationAggregateInput
  }

  export type ImpressionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImpressionsWhereInput | ImpressionsWhereInput[]
    OR?: ImpressionsWhereInput[]
    NOT?: ImpressionsWhereInput | ImpressionsWhereInput[]
    name?: StringFilter<"Impressions"> | string
    emoji?: StringFilter<"Impressions"> | string
    createdAt?: DateTimeFilter<"Impressions"> | Date | string
    updatedAt?: DateTimeFilter<"Impressions"> | Date | string
    questions?: Questions_impressionsListRelationFilter
  }, "id">

  export type ImpressionsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImpressionsCountOrderByAggregateInput
    _max?: ImpressionsMaxOrderByAggregateInput
    _min?: ImpressionsMinOrderByAggregateInput
  }

  export type ImpressionsScalarWhereWithAggregatesInput = {
    AND?: ImpressionsScalarWhereWithAggregatesInput | ImpressionsScalarWhereWithAggregatesInput[]
    OR?: ImpressionsScalarWhereWithAggregatesInput[]
    NOT?: ImpressionsScalarWhereWithAggregatesInput | ImpressionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Impressions"> | string
    name?: StringWithAggregatesFilter<"Impressions"> | string
    emoji?: StringWithAggregatesFilter<"Impressions"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Impressions"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Impressions"> | Date | string
  }

  export type Questions_impressionsWhereInput = {
    AND?: Questions_impressionsWhereInput | Questions_impressionsWhereInput[]
    OR?: Questions_impressionsWhereInput[]
    NOT?: Questions_impressionsWhereInput | Questions_impressionsWhereInput[]
    questionId?: StringFilter<"Questions_impressions"> | string
    impressionId?: StringFilter<"Questions_impressions"> | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
    impression?: XOR<ImpressionsScalarRelationFilter, ImpressionsWhereInput>
  }

  export type Questions_impressionsOrderByWithRelationInput = {
    questionId?: SortOrder
    impressionId?: SortOrder
    question?: QuestionsOrderByWithRelationInput
    impression?: ImpressionsOrderByWithRelationInput
  }

  export type Questions_impressionsWhereUniqueInput = Prisma.AtLeast<{
    questionId_impressionId?: Questions_impressionsQuestionIdImpressionIdCompoundUniqueInput
    AND?: Questions_impressionsWhereInput | Questions_impressionsWhereInput[]
    OR?: Questions_impressionsWhereInput[]
    NOT?: Questions_impressionsWhereInput | Questions_impressionsWhereInput[]
    questionId?: StringFilter<"Questions_impressions"> | string
    impressionId?: StringFilter<"Questions_impressions"> | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
    impression?: XOR<ImpressionsScalarRelationFilter, ImpressionsWhereInput>
  }, "questionId_impressionId">

  export type Questions_impressionsOrderByWithAggregationInput = {
    questionId?: SortOrder
    impressionId?: SortOrder
    _count?: Questions_impressionsCountOrderByAggregateInput
    _max?: Questions_impressionsMaxOrderByAggregateInput
    _min?: Questions_impressionsMinOrderByAggregateInput
  }

  export type Questions_impressionsScalarWhereWithAggregatesInput = {
    AND?: Questions_impressionsScalarWhereWithAggregatesInput | Questions_impressionsScalarWhereWithAggregatesInput[]
    OR?: Questions_impressionsScalarWhereWithAggregatesInput[]
    NOT?: Questions_impressionsScalarWhereWithAggregatesInput | Questions_impressionsScalarWhereWithAggregatesInput[]
    questionId?: StringWithAggregatesFilter<"Questions_impressions"> | string
    impressionId?: StringWithAggregatesFilter<"Questions_impressions"> | string
  }

  export type ChoicesWhereInput = {
    AND?: ChoicesWhereInput | ChoicesWhereInput[]
    OR?: ChoicesWhereInput[]
    NOT?: ChoicesWhereInput | ChoicesWhereInput[]
    id?: StringFilter<"Choices"> | string
    wording?: StringFilter<"Choices"> | string
    questionId?: StringFilter<"Choices"> | string
    createdAt?: DateTimeFilter<"Choices"> | Date | string
    updatedAt?: DateTimeFilter<"Choices"> | Date | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
  }

  export type ChoicesOrderByWithRelationInput = {
    id?: SortOrder
    wording?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    question?: QuestionsOrderByWithRelationInput
  }

  export type ChoicesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChoicesWhereInput | ChoicesWhereInput[]
    OR?: ChoicesWhereInput[]
    NOT?: ChoicesWhereInput | ChoicesWhereInput[]
    wording?: StringFilter<"Choices"> | string
    questionId?: StringFilter<"Choices"> | string
    createdAt?: DateTimeFilter<"Choices"> | Date | string
    updatedAt?: DateTimeFilter<"Choices"> | Date | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
  }, "id">

  export type ChoicesOrderByWithAggregationInput = {
    id?: SortOrder
    wording?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChoicesCountOrderByAggregateInput
    _max?: ChoicesMaxOrderByAggregateInput
    _min?: ChoicesMinOrderByAggregateInput
  }

  export type ChoicesScalarWhereWithAggregatesInput = {
    AND?: ChoicesScalarWhereWithAggregatesInput | ChoicesScalarWhereWithAggregatesInput[]
    OR?: ChoicesScalarWhereWithAggregatesInput[]
    NOT?: ChoicesScalarWhereWithAggregatesInput | ChoicesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Choices"> | string
    wording?: StringWithAggregatesFilter<"Choices"> | string
    questionId?: StringWithAggregatesFilter<"Choices"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Choices"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Choices"> | Date | string
  }

  export type AnswersWhereInput = {
    AND?: AnswersWhereInput | AnswersWhereInput[]
    OR?: AnswersWhereInput[]
    NOT?: AnswersWhereInput | AnswersWhereInput[]
    id?: StringFilter<"Answers"> | string
    uuid?: StringFilter<"Answers"> | string
    response?: StringFilter<"Answers"> | string
    questionId?: StringFilter<"Answers"> | string
    createdAt?: DateTimeFilter<"Answers"> | Date | string
    updatedAt?: DateTimeFilter<"Answers"> | Date | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
  }

  export type AnswersOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    response?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    question?: QuestionsOrderByWithRelationInput
  }

  export type AnswersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uuid?: string
    AND?: AnswersWhereInput | AnswersWhereInput[]
    OR?: AnswersWhereInput[]
    NOT?: AnswersWhereInput | AnswersWhereInput[]
    response?: StringFilter<"Answers"> | string
    questionId?: StringFilter<"Answers"> | string
    createdAt?: DateTimeFilter<"Answers"> | Date | string
    updatedAt?: DateTimeFilter<"Answers"> | Date | string
    question?: XOR<QuestionsScalarRelationFilter, QuestionsWhereInput>
  }, "id" | "uuid">

  export type AnswersOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    response?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnswersCountOrderByAggregateInput
    _max?: AnswersMaxOrderByAggregateInput
    _min?: AnswersMinOrderByAggregateInput
  }

  export type AnswersScalarWhereWithAggregatesInput = {
    AND?: AnswersScalarWhereWithAggregatesInput | AnswersScalarWhereWithAggregatesInput[]
    OR?: AnswersScalarWhereWithAggregatesInput[]
    NOT?: AnswersScalarWhereWithAggregatesInput | AnswersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Answers"> | string
    uuid?: StringWithAggregatesFilter<"Answers"> | string
    response?: StringWithAggregatesFilter<"Answers"> | string
    questionId?: StringWithAggregatesFilter<"Answers"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Answers"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Answers"> | Date | string
  }

  export type UsersWhereInput = {
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    id?: StringFilter<"Users"> | string
    email?: StringFilter<"Users"> | string
    password?: StringFilter<"Users"> | string
    role?: StringFilter<"Users"> | string
    active?: BoolFilter<"Users"> | boolean
    firstname?: StringFilter<"Users"> | string
    lastname?: StringFilter<"Users"> | string
    phone?: StringNullableFilter<"Users"> | string | null
    lastLoging?: DateTimeNullableFilter<"Users"> | Date | string | null
    createdBy?: StringNullableFilter<"Users"> | string | null
    createdAt?: DateTimeFilter<"Users"> | Date | string
    updatedAt?: DateTimeFilter<"Users"> | Date | string
  }

  export type UsersOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    active?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    phone?: SortOrderInput | SortOrder
    lastLoging?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    password?: StringFilter<"Users"> | string
    role?: StringFilter<"Users"> | string
    active?: BoolFilter<"Users"> | boolean
    firstname?: StringFilter<"Users"> | string
    lastname?: StringFilter<"Users"> | string
    phone?: StringNullableFilter<"Users"> | string | null
    lastLoging?: DateTimeNullableFilter<"Users"> | Date | string | null
    createdBy?: StringNullableFilter<"Users"> | string | null
    createdAt?: DateTimeFilter<"Users"> | Date | string
    updatedAt?: DateTimeFilter<"Users"> | Date | string
  }, "id" | "email">

  export type UsersOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    active?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    phone?: SortOrderInput | SortOrder
    lastLoging?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UsersCountOrderByAggregateInput
    _max?: UsersMaxOrderByAggregateInput
    _min?: UsersMinOrderByAggregateInput
  }

  export type UsersScalarWhereWithAggregatesInput = {
    AND?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    OR?: UsersScalarWhereWithAggregatesInput[]
    NOT?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Users"> | string
    email?: StringWithAggregatesFilter<"Users"> | string
    password?: StringWithAggregatesFilter<"Users"> | string
    role?: StringWithAggregatesFilter<"Users"> | string
    active?: BoolWithAggregatesFilter<"Users"> | boolean
    firstname?: StringWithAggregatesFilter<"Users"> | string
    lastname?: StringWithAggregatesFilter<"Users"> | string
    phone?: StringNullableWithAggregatesFilter<"Users"> | string | null
    lastLoging?: DateTimeNullableWithAggregatesFilter<"Users"> | Date | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Users"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Users"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Users"> | Date | string
  }

  export type SitesCreateInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    amenities?: AmenitiesCreateNestedManyWithoutSiteInput
    events?: EventsCreateNestedManyWithoutSiteInput
  }

  export type SitesUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    amenities?: AmenitiesUncheckedCreateNestedManyWithoutSiteInput
    events?: EventsUncheckedCreateNestedManyWithoutSiteInput
  }

  export type SitesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    amenities?: AmenitiesUpdateManyWithoutSiteNestedInput
    events?: EventsUpdateManyWithoutSiteNestedInput
  }

  export type SitesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    amenities?: AmenitiesUncheckedUpdateManyWithoutSiteNestedInput
    events?: EventsUncheckedUpdateManyWithoutSiteNestedInput
  }

  export type SitesCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SitesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SitesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmenitiesCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutAmenitiesInput
  }

  export type AmenitiesUncheckedCreateInput = {
    id?: string
    name: string
    siteId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmenitiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutAmenitiesNestedInput
  }

  export type AmenitiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmenitiesCreateManyInput = {
    id?: string
    name: string
    siteId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmenitiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmenitiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsTypesCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventsCreateNestedManyWithoutEventTypeInput
  }

  export type EventsTypesUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventsUncheckedCreateNestedManyWithoutEventTypeInput
  }

  export type EventsTypesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUpdateManyWithoutEventTypeNestedInput
  }

  export type EventsTypesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUncheckedUpdateManyWithoutEventTypeNestedInput
  }

  export type EventsTypesCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsTypesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsTypesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsCreateInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutEventsInput
    eventType: EventsTypesCreateNestedOneWithoutEventsInput
    programs?: ProgramsCreateNestedManyWithoutEventInput
    artists?: ArtistsCreateNestedManyWithoutEventInput
    quizzes?: QuizCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramsUncheckedCreateNestedManyWithoutEventInput
    artists?: ArtistsUncheckedCreateNestedManyWithoutEventInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutEventsNestedInput
    eventType?: EventsTypesUpdateOneRequiredWithoutEventsNestedInput
    programs?: ProgramsUpdateManyWithoutEventNestedInput
    artists?: ArtistsUpdateManyWithoutEventNestedInput
    quizzes?: QuizUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramsUncheckedUpdateManyWithoutEventNestedInput
    artists?: ArtistsUncheckedUpdateManyWithoutEventNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventsCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventsCreateNestedOneWithoutProgramsInput
  }

  export type ProgramsUncheckedCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventsUpdateOneRequiredWithoutProgramsNestedInput
  }

  export type ProgramsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsCreateManyInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventsCreateNestedOneWithoutArtistsInput
  }

  export type ArtistsUncheckedCreateInput = {
    id?: string
    name: string
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventsUpdateOneRequiredWithoutArtistsNestedInput
  }

  export type ArtistsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsCreateManyInput = {
    id?: string
    name: string
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizCreateInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventsCreateNestedOneWithoutQuizzesInput
    questions?: QuestionsCreateNestedManyWithoutQuizInput
  }

  export type QuizUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: QuestionsUncheckedCreateNestedManyWithoutQuizInput
  }

  export type QuizUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventsUpdateOneRequiredWithoutQuizzesNestedInput
    questions?: QuestionsUpdateManyWithoutQuizNestedInput
  }

  export type QuizUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuestionsUncheckedUpdateManyWithoutQuizNestedInput
  }

  export type QuizCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsTypesCreateInput = {
    id?: string
    types: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: QuestionsCreateNestedManyWithoutQuestionTypeInput
  }

  export type QuestionsTypesUncheckedCreateInput = {
    id?: string
    types: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: QuestionsUncheckedCreateNestedManyWithoutQuestionTypeInput
  }

  export type QuestionsTypesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuestionsUpdateManyWithoutQuestionTypeNestedInput
  }

  export type QuestionsTypesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuestionsUncheckedUpdateManyWithoutQuestionTypeNestedInput
  }

  export type QuestionsTypesCreateManyInput = {
    id?: string
    types: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsTypesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsTypesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsCreateInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questionType: QuestionsTypesCreateNestedOneWithoutQuestionsInput
    quiz: QuizCreateNestedOneWithoutQuestionsInput
    impressions?: Questions_impressionsCreateNestedManyWithoutQuestionInput
    choices?: ChoicesCreateNestedManyWithoutQuestionInput
    answers?: AnswersCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateInput = {
    id?: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    impressions?: Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput
    choices?: ChoicesUncheckedCreateNestedManyWithoutQuestionInput
    answers?: AnswersUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questionType?: QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput
    quiz?: QuizUpdateOneRequiredWithoutQuestionsNestedInput
    impressions?: Questions_impressionsUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impressions?: Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUncheckedUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsCreateManyInput = {
    id?: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImpressionsCreateInput = {
    id?: string
    name: string
    emoji: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: Questions_impressionsCreateNestedManyWithoutImpressionInput
  }

  export type ImpressionsUncheckedCreateInput = {
    id?: string
    name: string
    emoji: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: Questions_impressionsUncheckedCreateNestedManyWithoutImpressionInput
  }

  export type ImpressionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: Questions_impressionsUpdateManyWithoutImpressionNestedInput
  }

  export type ImpressionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: Questions_impressionsUncheckedUpdateManyWithoutImpressionNestedInput
  }

  export type ImpressionsCreateManyInput = {
    id?: string
    name: string
    emoji: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImpressionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImpressionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Questions_impressionsCreateInput = {
    question: QuestionsCreateNestedOneWithoutImpressionsInput
    impression: ImpressionsCreateNestedOneWithoutQuestionsInput
  }

  export type Questions_impressionsUncheckedCreateInput = {
    questionId: string
    impressionId: string
  }

  export type Questions_impressionsUpdateInput = {
    question?: QuestionsUpdateOneRequiredWithoutImpressionsNestedInput
    impression?: ImpressionsUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type Questions_impressionsUncheckedUpdateInput = {
    questionId?: StringFieldUpdateOperationsInput | string
    impressionId?: StringFieldUpdateOperationsInput | string
  }

  export type Questions_impressionsCreateManyInput = {
    questionId: string
    impressionId: string
  }

  export type Questions_impressionsUpdateManyMutationInput = {

  }

  export type Questions_impressionsUncheckedUpdateManyInput = {
    questionId?: StringFieldUpdateOperationsInput | string
    impressionId?: StringFieldUpdateOperationsInput | string
  }

  export type ChoicesCreateInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    question: QuestionsCreateNestedOneWithoutChoicesInput
  }

  export type ChoicesUncheckedCreateInput = {
    id?: string
    wording: string
    questionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChoicesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    question?: QuestionsUpdateOneRequiredWithoutChoicesNestedInput
  }

  export type ChoicesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChoicesCreateManyInput = {
    id?: string
    wording: string
    questionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChoicesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChoicesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersCreateInput = {
    id?: string
    uuid?: string
    response: string
    createdAt?: Date | string
    updatedAt?: Date | string
    question: QuestionsCreateNestedOneWithoutAnswersInput
  }

  export type AnswersUncheckedCreateInput = {
    id?: string
    uuid?: string
    response: string
    questionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnswersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    question?: QuestionsUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type AnswersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersCreateManyInput = {
    id?: string
    uuid?: string
    response: string
    questionId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnswersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsersCreateInput = {
    id?: string
    email: string
    password: string
    role: string
    active?: boolean
    firstname: string
    lastname: string
    phone?: string | null
    lastLoging?: Date | string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsersUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    role: string
    active?: boolean
    firstname: string
    lastname: string
    phone?: string | null
    lastLoging?: Date | string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoging?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoging?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsersCreateManyInput = {
    id?: string
    email: string
    password: string
    role: string
    active?: boolean
    firstname: string
    lastname: string
    phone?: string | null
    lastLoging?: Date | string | null
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoging?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoging?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AmenitiesListRelationFilter = {
    every?: AmenitiesWhereInput
    some?: AmenitiesWhereInput
    none?: AmenitiesWhereInput
  }

  export type EventsListRelationFilter = {
    every?: EventsWhereInput
    some?: EventsWhereInput
    none?: EventsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AmenitiesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SitesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SitesAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    capacity?: SortOrder
  }

  export type SitesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SitesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SitesSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    capacity?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SitesScalarRelationFilter = {
    is?: SitesWhereInput
    isNot?: SitesWhereInput
  }

  export type AmenitiesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    siteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmenitiesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    siteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmenitiesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    siteId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsTypesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsTypesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsTypesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsTypesScalarRelationFilter = {
    is?: EventsTypesWhereInput
    isNot?: EventsTypesWhereInput
  }

  export type ProgramsListRelationFilter = {
    every?: ProgramsWhereInput
    some?: ProgramsWhereInput
    none?: ProgramsWhereInput
  }

  export type ArtistsListRelationFilter = {
    every?: ArtistsWhereInput
    some?: ArtistsWhereInput
    none?: ArtistsWhereInput
  }

  export type QuizListRelationFilter = {
    every?: QuizWhereInput
    some?: QuizWhereInput
    none?: QuizWhereInput
  }

  export type ProgramsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArtistsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    siteId?: SortOrder
    eventTypeId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    siteId?: SortOrder
    eventTypeId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    siteId?: SortOrder
    eventTypeId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventsScalarRelationFilter = {
    is?: EventsWhereInput
    isNot?: EventsWhereInput
  }

  export type ProgramsCountOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramsMaxOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramsMinOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArtistsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type QuestionsListRelationFilter = {
    every?: QuestionsWhereInput
    some?: QuestionsWhereInput
    none?: QuestionsWhereInput
  }

  export type QuestionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    active?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuizMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    active?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuizMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    active?: SortOrder
    eventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type QuestionsTypesCountOrderByAggregateInput = {
    id?: SortOrder
    types?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsTypesMaxOrderByAggregateInput = {
    id?: SortOrder
    types?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsTypesMinOrderByAggregateInput = {
    id?: SortOrder
    types?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsTypesScalarRelationFilter = {
    is?: QuestionsTypesWhereInput
    isNot?: QuestionsTypesWhereInput
  }

  export type QuizScalarRelationFilter = {
    is?: QuizWhereInput
    isNot?: QuizWhereInput
  }

  export type Questions_impressionsListRelationFilter = {
    every?: Questions_impressionsWhereInput
    some?: Questions_impressionsWhereInput
    none?: Questions_impressionsWhereInput
  }

  export type ChoicesListRelationFilter = {
    every?: ChoicesWhereInput
    some?: ChoicesWhereInput
    none?: ChoicesWhereInput
  }

  export type AnswersListRelationFilter = {
    every?: AnswersWhereInput
    some?: AnswersWhereInput
    none?: AnswersWhereInput
  }

  export type Questions_impressionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChoicesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnswersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionsCountOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionTypeId?: SortOrder
    quizId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsMaxOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionTypeId?: SortOrder
    quizId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsMinOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionTypeId?: SortOrder
    quizId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImpressionsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImpressionsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImpressionsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    emoji?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuestionsScalarRelationFilter = {
    is?: QuestionsWhereInput
    isNot?: QuestionsWhereInput
  }

  export type ImpressionsScalarRelationFilter = {
    is?: ImpressionsWhereInput
    isNot?: ImpressionsWhereInput
  }

  export type Questions_impressionsQuestionIdImpressionIdCompoundUniqueInput = {
    questionId: string
    impressionId: string
  }

  export type Questions_impressionsCountOrderByAggregateInput = {
    questionId?: SortOrder
    impressionId?: SortOrder
  }

  export type Questions_impressionsMaxOrderByAggregateInput = {
    questionId?: SortOrder
    impressionId?: SortOrder
  }

  export type Questions_impressionsMinOrderByAggregateInput = {
    questionId?: SortOrder
    impressionId?: SortOrder
  }

  export type ChoicesCountOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChoicesMaxOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChoicesMinOrderByAggregateInput = {
    id?: SortOrder
    wording?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnswersCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    response?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnswersMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    response?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnswersMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    response?: SortOrder
    questionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UsersCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    active?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    phone?: SortOrder
    lastLoging?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsersMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    active?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    phone?: SortOrder
    lastLoging?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsersMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    active?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    phone?: SortOrder
    lastLoging?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AmenitiesCreateNestedManyWithoutSiteInput = {
    create?: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput> | AmenitiesCreateWithoutSiteInput[] | AmenitiesUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: AmenitiesCreateOrConnectWithoutSiteInput | AmenitiesCreateOrConnectWithoutSiteInput[]
    createMany?: AmenitiesCreateManySiteInputEnvelope
    connect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
  }

  export type EventsCreateNestedManyWithoutSiteInput = {
    create?: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput> | EventsCreateWithoutSiteInput[] | EventsUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutSiteInput | EventsCreateOrConnectWithoutSiteInput[]
    createMany?: EventsCreateManySiteInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type AmenitiesUncheckedCreateNestedManyWithoutSiteInput = {
    create?: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput> | AmenitiesCreateWithoutSiteInput[] | AmenitiesUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: AmenitiesCreateOrConnectWithoutSiteInput | AmenitiesCreateOrConnectWithoutSiteInput[]
    createMany?: AmenitiesCreateManySiteInputEnvelope
    connect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
  }

  export type EventsUncheckedCreateNestedManyWithoutSiteInput = {
    create?: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput> | EventsCreateWithoutSiteInput[] | EventsUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutSiteInput | EventsCreateOrConnectWithoutSiteInput[]
    createMany?: EventsCreateManySiteInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AmenitiesUpdateManyWithoutSiteNestedInput = {
    create?: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput> | AmenitiesCreateWithoutSiteInput[] | AmenitiesUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: AmenitiesCreateOrConnectWithoutSiteInput | AmenitiesCreateOrConnectWithoutSiteInput[]
    upsert?: AmenitiesUpsertWithWhereUniqueWithoutSiteInput | AmenitiesUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: AmenitiesCreateManySiteInputEnvelope
    set?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    disconnect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    delete?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    connect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    update?: AmenitiesUpdateWithWhereUniqueWithoutSiteInput | AmenitiesUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: AmenitiesUpdateManyWithWhereWithoutSiteInput | AmenitiesUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: AmenitiesScalarWhereInput | AmenitiesScalarWhereInput[]
  }

  export type EventsUpdateManyWithoutSiteNestedInput = {
    create?: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput> | EventsCreateWithoutSiteInput[] | EventsUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutSiteInput | EventsCreateOrConnectWithoutSiteInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutSiteInput | EventsUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: EventsCreateManySiteInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutSiteInput | EventsUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutSiteInput | EventsUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type AmenitiesUncheckedUpdateManyWithoutSiteNestedInput = {
    create?: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput> | AmenitiesCreateWithoutSiteInput[] | AmenitiesUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: AmenitiesCreateOrConnectWithoutSiteInput | AmenitiesCreateOrConnectWithoutSiteInput[]
    upsert?: AmenitiesUpsertWithWhereUniqueWithoutSiteInput | AmenitiesUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: AmenitiesCreateManySiteInputEnvelope
    set?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    disconnect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    delete?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    connect?: AmenitiesWhereUniqueInput | AmenitiesWhereUniqueInput[]
    update?: AmenitiesUpdateWithWhereUniqueWithoutSiteInput | AmenitiesUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: AmenitiesUpdateManyWithWhereWithoutSiteInput | AmenitiesUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: AmenitiesScalarWhereInput | AmenitiesScalarWhereInput[]
  }

  export type EventsUncheckedUpdateManyWithoutSiteNestedInput = {
    create?: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput> | EventsCreateWithoutSiteInput[] | EventsUncheckedCreateWithoutSiteInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutSiteInput | EventsCreateOrConnectWithoutSiteInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutSiteInput | EventsUpsertWithWhereUniqueWithoutSiteInput[]
    createMany?: EventsCreateManySiteInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutSiteInput | EventsUpdateWithWhereUniqueWithoutSiteInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutSiteInput | EventsUpdateManyWithWhereWithoutSiteInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type SitesCreateNestedOneWithoutAmenitiesInput = {
    create?: XOR<SitesCreateWithoutAmenitiesInput, SitesUncheckedCreateWithoutAmenitiesInput>
    connectOrCreate?: SitesCreateOrConnectWithoutAmenitiesInput
    connect?: SitesWhereUniqueInput
  }

  export type SitesUpdateOneRequiredWithoutAmenitiesNestedInput = {
    create?: XOR<SitesCreateWithoutAmenitiesInput, SitesUncheckedCreateWithoutAmenitiesInput>
    connectOrCreate?: SitesCreateOrConnectWithoutAmenitiesInput
    upsert?: SitesUpsertWithoutAmenitiesInput
    connect?: SitesWhereUniqueInput
    update?: XOR<XOR<SitesUpdateToOneWithWhereWithoutAmenitiesInput, SitesUpdateWithoutAmenitiesInput>, SitesUncheckedUpdateWithoutAmenitiesInput>
  }

  export type EventsCreateNestedManyWithoutEventTypeInput = {
    create?: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput> | EventsCreateWithoutEventTypeInput[] | EventsUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutEventTypeInput | EventsCreateOrConnectWithoutEventTypeInput[]
    createMany?: EventsCreateManyEventTypeInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type EventsUncheckedCreateNestedManyWithoutEventTypeInput = {
    create?: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput> | EventsCreateWithoutEventTypeInput[] | EventsUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutEventTypeInput | EventsCreateOrConnectWithoutEventTypeInput[]
    createMany?: EventsCreateManyEventTypeInputEnvelope
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
  }

  export type EventsUpdateManyWithoutEventTypeNestedInput = {
    create?: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput> | EventsCreateWithoutEventTypeInput[] | EventsUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutEventTypeInput | EventsCreateOrConnectWithoutEventTypeInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutEventTypeInput | EventsUpsertWithWhereUniqueWithoutEventTypeInput[]
    createMany?: EventsCreateManyEventTypeInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutEventTypeInput | EventsUpdateWithWhereUniqueWithoutEventTypeInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutEventTypeInput | EventsUpdateManyWithWhereWithoutEventTypeInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type EventsUncheckedUpdateManyWithoutEventTypeNestedInput = {
    create?: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput> | EventsCreateWithoutEventTypeInput[] | EventsUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: EventsCreateOrConnectWithoutEventTypeInput | EventsCreateOrConnectWithoutEventTypeInput[]
    upsert?: EventsUpsertWithWhereUniqueWithoutEventTypeInput | EventsUpsertWithWhereUniqueWithoutEventTypeInput[]
    createMany?: EventsCreateManyEventTypeInputEnvelope
    set?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    disconnect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    delete?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    connect?: EventsWhereUniqueInput | EventsWhereUniqueInput[]
    update?: EventsUpdateWithWhereUniqueWithoutEventTypeInput | EventsUpdateWithWhereUniqueWithoutEventTypeInput[]
    updateMany?: EventsUpdateManyWithWhereWithoutEventTypeInput | EventsUpdateManyWithWhereWithoutEventTypeInput[]
    deleteMany?: EventsScalarWhereInput | EventsScalarWhereInput[]
  }

  export type SitesCreateNestedOneWithoutEventsInput = {
    create?: XOR<SitesCreateWithoutEventsInput, SitesUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SitesCreateOrConnectWithoutEventsInput
    connect?: SitesWhereUniqueInput
  }

  export type EventsTypesCreateNestedOneWithoutEventsInput = {
    create?: XOR<EventsTypesCreateWithoutEventsInput, EventsTypesUncheckedCreateWithoutEventsInput>
    connectOrCreate?: EventsTypesCreateOrConnectWithoutEventsInput
    connect?: EventsTypesWhereUniqueInput
  }

  export type ProgramsCreateNestedManyWithoutEventInput = {
    create?: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput> | ProgramsCreateWithoutEventInput[] | ProgramsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ProgramsCreateOrConnectWithoutEventInput | ProgramsCreateOrConnectWithoutEventInput[]
    createMany?: ProgramsCreateManyEventInputEnvelope
    connect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
  }

  export type ArtistsCreateNestedManyWithoutEventInput = {
    create?: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput> | ArtistsCreateWithoutEventInput[] | ArtistsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ArtistsCreateOrConnectWithoutEventInput | ArtistsCreateOrConnectWithoutEventInput[]
    createMany?: ArtistsCreateManyEventInputEnvelope
    connect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
  }

  export type QuizCreateNestedManyWithoutEventInput = {
    create?: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput> | QuizCreateWithoutEventInput[] | QuizUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutEventInput | QuizCreateOrConnectWithoutEventInput[]
    createMany?: QuizCreateManyEventInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type ProgramsUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput> | ProgramsCreateWithoutEventInput[] | ProgramsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ProgramsCreateOrConnectWithoutEventInput | ProgramsCreateOrConnectWithoutEventInput[]
    createMany?: ProgramsCreateManyEventInputEnvelope
    connect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
  }

  export type ArtistsUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput> | ArtistsCreateWithoutEventInput[] | ArtistsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ArtistsCreateOrConnectWithoutEventInput | ArtistsCreateOrConnectWithoutEventInput[]
    createMany?: ArtistsCreateManyEventInputEnvelope
    connect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
  }

  export type QuizUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput> | QuizCreateWithoutEventInput[] | QuizUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutEventInput | QuizCreateOrConnectWithoutEventInput[]
    createMany?: QuizCreateManyEventInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type SitesUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<SitesCreateWithoutEventsInput, SitesUncheckedCreateWithoutEventsInput>
    connectOrCreate?: SitesCreateOrConnectWithoutEventsInput
    upsert?: SitesUpsertWithoutEventsInput
    connect?: SitesWhereUniqueInput
    update?: XOR<XOR<SitesUpdateToOneWithWhereWithoutEventsInput, SitesUpdateWithoutEventsInput>, SitesUncheckedUpdateWithoutEventsInput>
  }

  export type EventsTypesUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<EventsTypesCreateWithoutEventsInput, EventsTypesUncheckedCreateWithoutEventsInput>
    connectOrCreate?: EventsTypesCreateOrConnectWithoutEventsInput
    upsert?: EventsTypesUpsertWithoutEventsInput
    connect?: EventsTypesWhereUniqueInput
    update?: XOR<XOR<EventsTypesUpdateToOneWithWhereWithoutEventsInput, EventsTypesUpdateWithoutEventsInput>, EventsTypesUncheckedUpdateWithoutEventsInput>
  }

  export type ProgramsUpdateManyWithoutEventNestedInput = {
    create?: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput> | ProgramsCreateWithoutEventInput[] | ProgramsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ProgramsCreateOrConnectWithoutEventInput | ProgramsCreateOrConnectWithoutEventInput[]
    upsert?: ProgramsUpsertWithWhereUniqueWithoutEventInput | ProgramsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ProgramsCreateManyEventInputEnvelope
    set?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    disconnect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    delete?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    connect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    update?: ProgramsUpdateWithWhereUniqueWithoutEventInput | ProgramsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ProgramsUpdateManyWithWhereWithoutEventInput | ProgramsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ProgramsScalarWhereInput | ProgramsScalarWhereInput[]
  }

  export type ArtistsUpdateManyWithoutEventNestedInput = {
    create?: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput> | ArtistsCreateWithoutEventInput[] | ArtistsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ArtistsCreateOrConnectWithoutEventInput | ArtistsCreateOrConnectWithoutEventInput[]
    upsert?: ArtistsUpsertWithWhereUniqueWithoutEventInput | ArtistsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ArtistsCreateManyEventInputEnvelope
    set?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    disconnect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    delete?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    connect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    update?: ArtistsUpdateWithWhereUniqueWithoutEventInput | ArtistsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ArtistsUpdateManyWithWhereWithoutEventInput | ArtistsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ArtistsScalarWhereInput | ArtistsScalarWhereInput[]
  }

  export type QuizUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput> | QuizCreateWithoutEventInput[] | QuizUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutEventInput | QuizCreateOrConnectWithoutEventInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutEventInput | QuizUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuizCreateManyEventInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutEventInput | QuizUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutEventInput | QuizUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type ProgramsUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput> | ProgramsCreateWithoutEventInput[] | ProgramsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ProgramsCreateOrConnectWithoutEventInput | ProgramsCreateOrConnectWithoutEventInput[]
    upsert?: ProgramsUpsertWithWhereUniqueWithoutEventInput | ProgramsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ProgramsCreateManyEventInputEnvelope
    set?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    disconnect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    delete?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    connect?: ProgramsWhereUniqueInput | ProgramsWhereUniqueInput[]
    update?: ProgramsUpdateWithWhereUniqueWithoutEventInput | ProgramsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ProgramsUpdateManyWithWhereWithoutEventInput | ProgramsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ProgramsScalarWhereInput | ProgramsScalarWhereInput[]
  }

  export type ArtistsUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput> | ArtistsCreateWithoutEventInput[] | ArtistsUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ArtistsCreateOrConnectWithoutEventInput | ArtistsCreateOrConnectWithoutEventInput[]
    upsert?: ArtistsUpsertWithWhereUniqueWithoutEventInput | ArtistsUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ArtistsCreateManyEventInputEnvelope
    set?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    disconnect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    delete?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    connect?: ArtistsWhereUniqueInput | ArtistsWhereUniqueInput[]
    update?: ArtistsUpdateWithWhereUniqueWithoutEventInput | ArtistsUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ArtistsUpdateManyWithWhereWithoutEventInput | ArtistsUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ArtistsScalarWhereInput | ArtistsScalarWhereInput[]
  }

  export type QuizUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput> | QuizCreateWithoutEventInput[] | QuizUncheckedCreateWithoutEventInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutEventInput | QuizCreateOrConnectWithoutEventInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutEventInput | QuizUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: QuizCreateManyEventInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutEventInput | QuizUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutEventInput | QuizUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type EventsCreateNestedOneWithoutProgramsInput = {
    create?: XOR<EventsCreateWithoutProgramsInput, EventsUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: EventsCreateOrConnectWithoutProgramsInput
    connect?: EventsWhereUniqueInput
  }

  export type EventsUpdateOneRequiredWithoutProgramsNestedInput = {
    create?: XOR<EventsCreateWithoutProgramsInput, EventsUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: EventsCreateOrConnectWithoutProgramsInput
    upsert?: EventsUpsertWithoutProgramsInput
    connect?: EventsWhereUniqueInput
    update?: XOR<XOR<EventsUpdateToOneWithWhereWithoutProgramsInput, EventsUpdateWithoutProgramsInput>, EventsUncheckedUpdateWithoutProgramsInput>
  }

  export type EventsCreateNestedOneWithoutArtistsInput = {
    create?: XOR<EventsCreateWithoutArtistsInput, EventsUncheckedCreateWithoutArtistsInput>
    connectOrCreate?: EventsCreateOrConnectWithoutArtistsInput
    connect?: EventsWhereUniqueInput
  }

  export type EventsUpdateOneRequiredWithoutArtistsNestedInput = {
    create?: XOR<EventsCreateWithoutArtistsInput, EventsUncheckedCreateWithoutArtistsInput>
    connectOrCreate?: EventsCreateOrConnectWithoutArtistsInput
    upsert?: EventsUpsertWithoutArtistsInput
    connect?: EventsWhereUniqueInput
    update?: XOR<XOR<EventsUpdateToOneWithWhereWithoutArtistsInput, EventsUpdateWithoutArtistsInput>, EventsUncheckedUpdateWithoutArtistsInput>
  }

  export type EventsCreateNestedOneWithoutQuizzesInput = {
    create?: XOR<EventsCreateWithoutQuizzesInput, EventsUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: EventsCreateOrConnectWithoutQuizzesInput
    connect?: EventsWhereUniqueInput
  }

  export type QuestionsCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput> | QuestionsCreateWithoutQuizInput[] | QuestionsUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuizInput | QuestionsCreateOrConnectWithoutQuizInput[]
    createMany?: QuestionsCreateManyQuizInputEnvelope
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
  }

  export type QuestionsUncheckedCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput> | QuestionsCreateWithoutQuizInput[] | QuestionsUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuizInput | QuestionsCreateOrConnectWithoutQuizInput[]
    createMany?: QuestionsCreateManyQuizInputEnvelope
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EventsUpdateOneRequiredWithoutQuizzesNestedInput = {
    create?: XOR<EventsCreateWithoutQuizzesInput, EventsUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: EventsCreateOrConnectWithoutQuizzesInput
    upsert?: EventsUpsertWithoutQuizzesInput
    connect?: EventsWhereUniqueInput
    update?: XOR<XOR<EventsUpdateToOneWithWhereWithoutQuizzesInput, EventsUpdateWithoutQuizzesInput>, EventsUncheckedUpdateWithoutQuizzesInput>
  }

  export type QuestionsUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput> | QuestionsCreateWithoutQuizInput[] | QuestionsUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuizInput | QuestionsCreateOrConnectWithoutQuizInput[]
    upsert?: QuestionsUpsertWithWhereUniqueWithoutQuizInput | QuestionsUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuestionsCreateManyQuizInputEnvelope
    set?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    disconnect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    delete?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    update?: QuestionsUpdateWithWhereUniqueWithoutQuizInput | QuestionsUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuestionsUpdateManyWithWhereWithoutQuizInput | QuestionsUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
  }

  export type QuestionsUncheckedUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput> | QuestionsCreateWithoutQuizInput[] | QuestionsUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuizInput | QuestionsCreateOrConnectWithoutQuizInput[]
    upsert?: QuestionsUpsertWithWhereUniqueWithoutQuizInput | QuestionsUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuestionsCreateManyQuizInputEnvelope
    set?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    disconnect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    delete?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    update?: QuestionsUpdateWithWhereUniqueWithoutQuizInput | QuestionsUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuestionsUpdateManyWithWhereWithoutQuizInput | QuestionsUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
  }

  export type QuestionsCreateNestedManyWithoutQuestionTypeInput = {
    create?: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput> | QuestionsCreateWithoutQuestionTypeInput[] | QuestionsUncheckedCreateWithoutQuestionTypeInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuestionTypeInput | QuestionsCreateOrConnectWithoutQuestionTypeInput[]
    createMany?: QuestionsCreateManyQuestionTypeInputEnvelope
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
  }

  export type QuestionsUncheckedCreateNestedManyWithoutQuestionTypeInput = {
    create?: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput> | QuestionsCreateWithoutQuestionTypeInput[] | QuestionsUncheckedCreateWithoutQuestionTypeInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuestionTypeInput | QuestionsCreateOrConnectWithoutQuestionTypeInput[]
    createMany?: QuestionsCreateManyQuestionTypeInputEnvelope
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
  }

  export type QuestionsUpdateManyWithoutQuestionTypeNestedInput = {
    create?: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput> | QuestionsCreateWithoutQuestionTypeInput[] | QuestionsUncheckedCreateWithoutQuestionTypeInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuestionTypeInput | QuestionsCreateOrConnectWithoutQuestionTypeInput[]
    upsert?: QuestionsUpsertWithWhereUniqueWithoutQuestionTypeInput | QuestionsUpsertWithWhereUniqueWithoutQuestionTypeInput[]
    createMany?: QuestionsCreateManyQuestionTypeInputEnvelope
    set?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    disconnect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    delete?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    update?: QuestionsUpdateWithWhereUniqueWithoutQuestionTypeInput | QuestionsUpdateWithWhereUniqueWithoutQuestionTypeInput[]
    updateMany?: QuestionsUpdateManyWithWhereWithoutQuestionTypeInput | QuestionsUpdateManyWithWhereWithoutQuestionTypeInput[]
    deleteMany?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
  }

  export type QuestionsUncheckedUpdateManyWithoutQuestionTypeNestedInput = {
    create?: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput> | QuestionsCreateWithoutQuestionTypeInput[] | QuestionsUncheckedCreateWithoutQuestionTypeInput[]
    connectOrCreate?: QuestionsCreateOrConnectWithoutQuestionTypeInput | QuestionsCreateOrConnectWithoutQuestionTypeInput[]
    upsert?: QuestionsUpsertWithWhereUniqueWithoutQuestionTypeInput | QuestionsUpsertWithWhereUniqueWithoutQuestionTypeInput[]
    createMany?: QuestionsCreateManyQuestionTypeInputEnvelope
    set?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    disconnect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    delete?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    connect?: QuestionsWhereUniqueInput | QuestionsWhereUniqueInput[]
    update?: QuestionsUpdateWithWhereUniqueWithoutQuestionTypeInput | QuestionsUpdateWithWhereUniqueWithoutQuestionTypeInput[]
    updateMany?: QuestionsUpdateManyWithWhereWithoutQuestionTypeInput | QuestionsUpdateManyWithWhereWithoutQuestionTypeInput[]
    deleteMany?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
  }

  export type QuestionsTypesCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<QuestionsTypesCreateWithoutQuestionsInput, QuestionsTypesUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuestionsTypesCreateOrConnectWithoutQuestionsInput
    connect?: QuestionsTypesWhereUniqueInput
  }

  export type QuizCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<QuizCreateWithoutQuestionsInput, QuizUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuizCreateOrConnectWithoutQuestionsInput
    connect?: QuizWhereUniqueInput
  }

  export type Questions_impressionsCreateNestedManyWithoutQuestionInput = {
    create?: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput> | Questions_impressionsCreateWithoutQuestionInput[] | Questions_impressionsUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutQuestionInput | Questions_impressionsCreateOrConnectWithoutQuestionInput[]
    createMany?: Questions_impressionsCreateManyQuestionInputEnvelope
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
  }

  export type ChoicesCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput> | ChoicesCreateWithoutQuestionInput[] | ChoicesUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ChoicesCreateOrConnectWithoutQuestionInput | ChoicesCreateOrConnectWithoutQuestionInput[]
    createMany?: ChoicesCreateManyQuestionInputEnvelope
    connect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
  }

  export type AnswersCreateNestedManyWithoutQuestionInput = {
    create?: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput> | AnswersCreateWithoutQuestionInput[] | AnswersUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswersCreateOrConnectWithoutQuestionInput | AnswersCreateOrConnectWithoutQuestionInput[]
    createMany?: AnswersCreateManyQuestionInputEnvelope
    connect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
  }

  export type Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput> | Questions_impressionsCreateWithoutQuestionInput[] | Questions_impressionsUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutQuestionInput | Questions_impressionsCreateOrConnectWithoutQuestionInput[]
    createMany?: Questions_impressionsCreateManyQuestionInputEnvelope
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
  }

  export type ChoicesUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput> | ChoicesCreateWithoutQuestionInput[] | ChoicesUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ChoicesCreateOrConnectWithoutQuestionInput | ChoicesCreateOrConnectWithoutQuestionInput[]
    createMany?: ChoicesCreateManyQuestionInputEnvelope
    connect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
  }

  export type AnswersUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput> | AnswersCreateWithoutQuestionInput[] | AnswersUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswersCreateOrConnectWithoutQuestionInput | AnswersCreateOrConnectWithoutQuestionInput[]
    createMany?: AnswersCreateManyQuestionInputEnvelope
    connect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
  }

  export type QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<QuestionsTypesCreateWithoutQuestionsInput, QuestionsTypesUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuestionsTypesCreateOrConnectWithoutQuestionsInput
    upsert?: QuestionsTypesUpsertWithoutQuestionsInput
    connect?: QuestionsTypesWhereUniqueInput
    update?: XOR<XOR<QuestionsTypesUpdateToOneWithWhereWithoutQuestionsInput, QuestionsTypesUpdateWithoutQuestionsInput>, QuestionsTypesUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuizUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<QuizCreateWithoutQuestionsInput, QuizUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuizCreateOrConnectWithoutQuestionsInput
    upsert?: QuizUpsertWithoutQuestionsInput
    connect?: QuizWhereUniqueInput
    update?: XOR<XOR<QuizUpdateToOneWithWhereWithoutQuestionsInput, QuizUpdateWithoutQuestionsInput>, QuizUncheckedUpdateWithoutQuestionsInput>
  }

  export type Questions_impressionsUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput> | Questions_impressionsCreateWithoutQuestionInput[] | Questions_impressionsUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutQuestionInput | Questions_impressionsCreateOrConnectWithoutQuestionInput[]
    upsert?: Questions_impressionsUpsertWithWhereUniqueWithoutQuestionInput | Questions_impressionsUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: Questions_impressionsCreateManyQuestionInputEnvelope
    set?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    disconnect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    delete?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    update?: Questions_impressionsUpdateWithWhereUniqueWithoutQuestionInput | Questions_impressionsUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: Questions_impressionsUpdateManyWithWhereWithoutQuestionInput | Questions_impressionsUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
  }

  export type ChoicesUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput> | ChoicesCreateWithoutQuestionInput[] | ChoicesUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ChoicesCreateOrConnectWithoutQuestionInput | ChoicesCreateOrConnectWithoutQuestionInput[]
    upsert?: ChoicesUpsertWithWhereUniqueWithoutQuestionInput | ChoicesUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ChoicesCreateManyQuestionInputEnvelope
    set?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    disconnect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    delete?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    connect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    update?: ChoicesUpdateWithWhereUniqueWithoutQuestionInput | ChoicesUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ChoicesUpdateManyWithWhereWithoutQuestionInput | ChoicesUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ChoicesScalarWhereInput | ChoicesScalarWhereInput[]
  }

  export type AnswersUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput> | AnswersCreateWithoutQuestionInput[] | AnswersUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswersCreateOrConnectWithoutQuestionInput | AnswersCreateOrConnectWithoutQuestionInput[]
    upsert?: AnswersUpsertWithWhereUniqueWithoutQuestionInput | AnswersUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: AnswersCreateManyQuestionInputEnvelope
    set?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    disconnect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    delete?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    connect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    update?: AnswersUpdateWithWhereUniqueWithoutQuestionInput | AnswersUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: AnswersUpdateManyWithWhereWithoutQuestionInput | AnswersUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: AnswersScalarWhereInput | AnswersScalarWhereInput[]
  }

  export type Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput> | Questions_impressionsCreateWithoutQuestionInput[] | Questions_impressionsUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutQuestionInput | Questions_impressionsCreateOrConnectWithoutQuestionInput[]
    upsert?: Questions_impressionsUpsertWithWhereUniqueWithoutQuestionInput | Questions_impressionsUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: Questions_impressionsCreateManyQuestionInputEnvelope
    set?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    disconnect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    delete?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    update?: Questions_impressionsUpdateWithWhereUniqueWithoutQuestionInput | Questions_impressionsUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: Questions_impressionsUpdateManyWithWhereWithoutQuestionInput | Questions_impressionsUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
  }

  export type ChoicesUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput> | ChoicesCreateWithoutQuestionInput[] | ChoicesUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: ChoicesCreateOrConnectWithoutQuestionInput | ChoicesCreateOrConnectWithoutQuestionInput[]
    upsert?: ChoicesUpsertWithWhereUniqueWithoutQuestionInput | ChoicesUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: ChoicesCreateManyQuestionInputEnvelope
    set?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    disconnect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    delete?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    connect?: ChoicesWhereUniqueInput | ChoicesWhereUniqueInput[]
    update?: ChoicesUpdateWithWhereUniqueWithoutQuestionInput | ChoicesUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: ChoicesUpdateManyWithWhereWithoutQuestionInput | ChoicesUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: ChoicesScalarWhereInput | ChoicesScalarWhereInput[]
  }

  export type AnswersUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput> | AnswersCreateWithoutQuestionInput[] | AnswersUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: AnswersCreateOrConnectWithoutQuestionInput | AnswersCreateOrConnectWithoutQuestionInput[]
    upsert?: AnswersUpsertWithWhereUniqueWithoutQuestionInput | AnswersUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: AnswersCreateManyQuestionInputEnvelope
    set?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    disconnect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    delete?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    connect?: AnswersWhereUniqueInput | AnswersWhereUniqueInput[]
    update?: AnswersUpdateWithWhereUniqueWithoutQuestionInput | AnswersUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: AnswersUpdateManyWithWhereWithoutQuestionInput | AnswersUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: AnswersScalarWhereInput | AnswersScalarWhereInput[]
  }

  export type Questions_impressionsCreateNestedManyWithoutImpressionInput = {
    create?: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput> | Questions_impressionsCreateWithoutImpressionInput[] | Questions_impressionsUncheckedCreateWithoutImpressionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutImpressionInput | Questions_impressionsCreateOrConnectWithoutImpressionInput[]
    createMany?: Questions_impressionsCreateManyImpressionInputEnvelope
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
  }

  export type Questions_impressionsUncheckedCreateNestedManyWithoutImpressionInput = {
    create?: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput> | Questions_impressionsCreateWithoutImpressionInput[] | Questions_impressionsUncheckedCreateWithoutImpressionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutImpressionInput | Questions_impressionsCreateOrConnectWithoutImpressionInput[]
    createMany?: Questions_impressionsCreateManyImpressionInputEnvelope
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
  }

  export type Questions_impressionsUpdateManyWithoutImpressionNestedInput = {
    create?: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput> | Questions_impressionsCreateWithoutImpressionInput[] | Questions_impressionsUncheckedCreateWithoutImpressionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutImpressionInput | Questions_impressionsCreateOrConnectWithoutImpressionInput[]
    upsert?: Questions_impressionsUpsertWithWhereUniqueWithoutImpressionInput | Questions_impressionsUpsertWithWhereUniqueWithoutImpressionInput[]
    createMany?: Questions_impressionsCreateManyImpressionInputEnvelope
    set?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    disconnect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    delete?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    update?: Questions_impressionsUpdateWithWhereUniqueWithoutImpressionInput | Questions_impressionsUpdateWithWhereUniqueWithoutImpressionInput[]
    updateMany?: Questions_impressionsUpdateManyWithWhereWithoutImpressionInput | Questions_impressionsUpdateManyWithWhereWithoutImpressionInput[]
    deleteMany?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
  }

  export type Questions_impressionsUncheckedUpdateManyWithoutImpressionNestedInput = {
    create?: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput> | Questions_impressionsCreateWithoutImpressionInput[] | Questions_impressionsUncheckedCreateWithoutImpressionInput[]
    connectOrCreate?: Questions_impressionsCreateOrConnectWithoutImpressionInput | Questions_impressionsCreateOrConnectWithoutImpressionInput[]
    upsert?: Questions_impressionsUpsertWithWhereUniqueWithoutImpressionInput | Questions_impressionsUpsertWithWhereUniqueWithoutImpressionInput[]
    createMany?: Questions_impressionsCreateManyImpressionInputEnvelope
    set?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    disconnect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    delete?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    connect?: Questions_impressionsWhereUniqueInput | Questions_impressionsWhereUniqueInput[]
    update?: Questions_impressionsUpdateWithWhereUniqueWithoutImpressionInput | Questions_impressionsUpdateWithWhereUniqueWithoutImpressionInput[]
    updateMany?: Questions_impressionsUpdateManyWithWhereWithoutImpressionInput | Questions_impressionsUpdateManyWithWhereWithoutImpressionInput[]
    deleteMany?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
  }

  export type QuestionsCreateNestedOneWithoutImpressionsInput = {
    create?: XOR<QuestionsCreateWithoutImpressionsInput, QuestionsUncheckedCreateWithoutImpressionsInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutImpressionsInput
    connect?: QuestionsWhereUniqueInput
  }

  export type ImpressionsCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<ImpressionsCreateWithoutQuestionsInput, ImpressionsUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: ImpressionsCreateOrConnectWithoutQuestionsInput
    connect?: ImpressionsWhereUniqueInput
  }

  export type QuestionsUpdateOneRequiredWithoutImpressionsNestedInput = {
    create?: XOR<QuestionsCreateWithoutImpressionsInput, QuestionsUncheckedCreateWithoutImpressionsInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutImpressionsInput
    upsert?: QuestionsUpsertWithoutImpressionsInput
    connect?: QuestionsWhereUniqueInput
    update?: XOR<XOR<QuestionsUpdateToOneWithWhereWithoutImpressionsInput, QuestionsUpdateWithoutImpressionsInput>, QuestionsUncheckedUpdateWithoutImpressionsInput>
  }

  export type ImpressionsUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<ImpressionsCreateWithoutQuestionsInput, ImpressionsUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: ImpressionsCreateOrConnectWithoutQuestionsInput
    upsert?: ImpressionsUpsertWithoutQuestionsInput
    connect?: ImpressionsWhereUniqueInput
    update?: XOR<XOR<ImpressionsUpdateToOneWithWhereWithoutQuestionsInput, ImpressionsUpdateWithoutQuestionsInput>, ImpressionsUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuestionsCreateNestedOneWithoutChoicesInput = {
    create?: XOR<QuestionsCreateWithoutChoicesInput, QuestionsUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutChoicesInput
    connect?: QuestionsWhereUniqueInput
  }

  export type QuestionsUpdateOneRequiredWithoutChoicesNestedInput = {
    create?: XOR<QuestionsCreateWithoutChoicesInput, QuestionsUncheckedCreateWithoutChoicesInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutChoicesInput
    upsert?: QuestionsUpsertWithoutChoicesInput
    connect?: QuestionsWhereUniqueInput
    update?: XOR<XOR<QuestionsUpdateToOneWithWhereWithoutChoicesInput, QuestionsUpdateWithoutChoicesInput>, QuestionsUncheckedUpdateWithoutChoicesInput>
  }

  export type QuestionsCreateNestedOneWithoutAnswersInput = {
    create?: XOR<QuestionsCreateWithoutAnswersInput, QuestionsUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutAnswersInput
    connect?: QuestionsWhereUniqueInput
  }

  export type QuestionsUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<QuestionsCreateWithoutAnswersInput, QuestionsUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuestionsCreateOrConnectWithoutAnswersInput
    upsert?: QuestionsUpsertWithoutAnswersInput
    connect?: QuestionsWhereUniqueInput
    update?: XOR<XOR<QuestionsUpdateToOneWithWhereWithoutAnswersInput, QuestionsUpdateWithoutAnswersInput>, QuestionsUncheckedUpdateWithoutAnswersInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AmenitiesCreateWithoutSiteInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmenitiesUncheckedCreateWithoutSiteInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmenitiesCreateOrConnectWithoutSiteInput = {
    where: AmenitiesWhereUniqueInput
    create: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput>
  }

  export type AmenitiesCreateManySiteInputEnvelope = {
    data: AmenitiesCreateManySiteInput | AmenitiesCreateManySiteInput[]
    skipDuplicates?: boolean
  }

  export type EventsCreateWithoutSiteInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: EventsTypesCreateNestedOneWithoutEventsInput
    programs?: ProgramsCreateNestedManyWithoutEventInput
    artists?: ArtistsCreateNestedManyWithoutEventInput
    quizzes?: QuizCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateWithoutSiteInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramsUncheckedCreateNestedManyWithoutEventInput
    artists?: ArtistsUncheckedCreateNestedManyWithoutEventInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsCreateOrConnectWithoutSiteInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput>
  }

  export type EventsCreateManySiteInputEnvelope = {
    data: EventsCreateManySiteInput | EventsCreateManySiteInput[]
    skipDuplicates?: boolean
  }

  export type AmenitiesUpsertWithWhereUniqueWithoutSiteInput = {
    where: AmenitiesWhereUniqueInput
    update: XOR<AmenitiesUpdateWithoutSiteInput, AmenitiesUncheckedUpdateWithoutSiteInput>
    create: XOR<AmenitiesCreateWithoutSiteInput, AmenitiesUncheckedCreateWithoutSiteInput>
  }

  export type AmenitiesUpdateWithWhereUniqueWithoutSiteInput = {
    where: AmenitiesWhereUniqueInput
    data: XOR<AmenitiesUpdateWithoutSiteInput, AmenitiesUncheckedUpdateWithoutSiteInput>
  }

  export type AmenitiesUpdateManyWithWhereWithoutSiteInput = {
    where: AmenitiesScalarWhereInput
    data: XOR<AmenitiesUpdateManyMutationInput, AmenitiesUncheckedUpdateManyWithoutSiteInput>
  }

  export type AmenitiesScalarWhereInput = {
    AND?: AmenitiesScalarWhereInput | AmenitiesScalarWhereInput[]
    OR?: AmenitiesScalarWhereInput[]
    NOT?: AmenitiesScalarWhereInput | AmenitiesScalarWhereInput[]
    id?: StringFilter<"Amenities"> | string
    name?: StringFilter<"Amenities"> | string
    siteId?: StringFilter<"Amenities"> | string
    createdAt?: DateTimeFilter<"Amenities"> | Date | string
    updatedAt?: DateTimeFilter<"Amenities"> | Date | string
  }

  export type EventsUpsertWithWhereUniqueWithoutSiteInput = {
    where: EventsWhereUniqueInput
    update: XOR<EventsUpdateWithoutSiteInput, EventsUncheckedUpdateWithoutSiteInput>
    create: XOR<EventsCreateWithoutSiteInput, EventsUncheckedCreateWithoutSiteInput>
  }

  export type EventsUpdateWithWhereUniqueWithoutSiteInput = {
    where: EventsWhereUniqueInput
    data: XOR<EventsUpdateWithoutSiteInput, EventsUncheckedUpdateWithoutSiteInput>
  }

  export type EventsUpdateManyWithWhereWithoutSiteInput = {
    where: EventsScalarWhereInput
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyWithoutSiteInput>
  }

  export type EventsScalarWhereInput = {
    AND?: EventsScalarWhereInput | EventsScalarWhereInput[]
    OR?: EventsScalarWhereInput[]
    NOT?: EventsScalarWhereInput | EventsScalarWhereInput[]
    id?: StringFilter<"Events"> | string
    name?: StringFilter<"Events"> | string
    description?: StringNullableFilter<"Events"> | string | null
    status?: StringFilter<"Events"> | string
    siteId?: StringFilter<"Events"> | string
    eventTypeId?: StringFilter<"Events"> | string
    createdBy?: StringFilter<"Events"> | string
    createdAt?: DateTimeFilter<"Events"> | Date | string
    updatedAt?: DateTimeFilter<"Events"> | Date | string
  }

  export type SitesCreateWithoutAmenitiesInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventsCreateNestedManyWithoutSiteInput
  }

  export type SitesUncheckedCreateWithoutAmenitiesInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: EventsUncheckedCreateNestedManyWithoutSiteInput
  }

  export type SitesCreateOrConnectWithoutAmenitiesInput = {
    where: SitesWhereUniqueInput
    create: XOR<SitesCreateWithoutAmenitiesInput, SitesUncheckedCreateWithoutAmenitiesInput>
  }

  export type SitesUpsertWithoutAmenitiesInput = {
    update: XOR<SitesUpdateWithoutAmenitiesInput, SitesUncheckedUpdateWithoutAmenitiesInput>
    create: XOR<SitesCreateWithoutAmenitiesInput, SitesUncheckedCreateWithoutAmenitiesInput>
    where?: SitesWhereInput
  }

  export type SitesUpdateToOneWithWhereWithoutAmenitiesInput = {
    where?: SitesWhereInput
    data: XOR<SitesUpdateWithoutAmenitiesInput, SitesUncheckedUpdateWithoutAmenitiesInput>
  }

  export type SitesUpdateWithoutAmenitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUpdateManyWithoutSiteNestedInput
  }

  export type SitesUncheckedUpdateWithoutAmenitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: EventsUncheckedUpdateManyWithoutSiteNestedInput
  }

  export type EventsCreateWithoutEventTypeInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutEventsInput
    programs?: ProgramsCreateNestedManyWithoutEventInput
    artists?: ArtistsCreateNestedManyWithoutEventInput
    quizzes?: QuizCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateWithoutEventTypeInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramsUncheckedCreateNestedManyWithoutEventInput
    artists?: ArtistsUncheckedCreateNestedManyWithoutEventInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsCreateOrConnectWithoutEventTypeInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput>
  }

  export type EventsCreateManyEventTypeInputEnvelope = {
    data: EventsCreateManyEventTypeInput | EventsCreateManyEventTypeInput[]
    skipDuplicates?: boolean
  }

  export type EventsUpsertWithWhereUniqueWithoutEventTypeInput = {
    where: EventsWhereUniqueInput
    update: XOR<EventsUpdateWithoutEventTypeInput, EventsUncheckedUpdateWithoutEventTypeInput>
    create: XOR<EventsCreateWithoutEventTypeInput, EventsUncheckedCreateWithoutEventTypeInput>
  }

  export type EventsUpdateWithWhereUniqueWithoutEventTypeInput = {
    where: EventsWhereUniqueInput
    data: XOR<EventsUpdateWithoutEventTypeInput, EventsUncheckedUpdateWithoutEventTypeInput>
  }

  export type EventsUpdateManyWithWhereWithoutEventTypeInput = {
    where: EventsScalarWhereInput
    data: XOR<EventsUpdateManyMutationInput, EventsUncheckedUpdateManyWithoutEventTypeInput>
  }

  export type SitesCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    amenities?: AmenitiesCreateNestedManyWithoutSiteInput
  }

  export type SitesUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    latitude: number
    longitude: number
    type: string
    capacity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    amenities?: AmenitiesUncheckedCreateNestedManyWithoutSiteInput
  }

  export type SitesCreateOrConnectWithoutEventsInput = {
    where: SitesWhereUniqueInput
    create: XOR<SitesCreateWithoutEventsInput, SitesUncheckedCreateWithoutEventsInput>
  }

  export type EventsTypesCreateWithoutEventsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsTypesUncheckedCreateWithoutEventsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsTypesCreateOrConnectWithoutEventsInput = {
    where: EventsTypesWhereUniqueInput
    create: XOR<EventsTypesCreateWithoutEventsInput, EventsTypesUncheckedCreateWithoutEventsInput>
  }

  export type ProgramsCreateWithoutEventInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramsUncheckedCreateWithoutEventInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramsCreateOrConnectWithoutEventInput = {
    where: ProgramsWhereUniqueInput
    create: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput>
  }

  export type ProgramsCreateManyEventInputEnvelope = {
    data: ProgramsCreateManyEventInput | ProgramsCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type ArtistsCreateWithoutEventInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistsUncheckedCreateWithoutEventInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistsCreateOrConnectWithoutEventInput = {
    where: ArtistsWhereUniqueInput
    create: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput>
  }

  export type ArtistsCreateManyEventInputEnvelope = {
    data: ArtistsCreateManyEventInput | ArtistsCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type QuizCreateWithoutEventInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: QuestionsCreateNestedManyWithoutQuizInput
  }

  export type QuizUncheckedCreateWithoutEventInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    questions?: QuestionsUncheckedCreateNestedManyWithoutQuizInput
  }

  export type QuizCreateOrConnectWithoutEventInput = {
    where: QuizWhereUniqueInput
    create: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput>
  }

  export type QuizCreateManyEventInputEnvelope = {
    data: QuizCreateManyEventInput | QuizCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type SitesUpsertWithoutEventsInput = {
    update: XOR<SitesUpdateWithoutEventsInput, SitesUncheckedUpdateWithoutEventsInput>
    create: XOR<SitesCreateWithoutEventsInput, SitesUncheckedCreateWithoutEventsInput>
    where?: SitesWhereInput
  }

  export type SitesUpdateToOneWithWhereWithoutEventsInput = {
    where?: SitesWhereInput
    data: XOR<SitesUpdateWithoutEventsInput, SitesUncheckedUpdateWithoutEventsInput>
  }

  export type SitesUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    amenities?: AmenitiesUpdateManyWithoutSiteNestedInput
  }

  export type SitesUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    amenities?: AmenitiesUncheckedUpdateManyWithoutSiteNestedInput
  }

  export type EventsTypesUpsertWithoutEventsInput = {
    update: XOR<EventsTypesUpdateWithoutEventsInput, EventsTypesUncheckedUpdateWithoutEventsInput>
    create: XOR<EventsTypesCreateWithoutEventsInput, EventsTypesUncheckedCreateWithoutEventsInput>
    where?: EventsTypesWhereInput
  }

  export type EventsTypesUpdateToOneWithWhereWithoutEventsInput = {
    where?: EventsTypesWhereInput
    data: XOR<EventsTypesUpdateWithoutEventsInput, EventsTypesUncheckedUpdateWithoutEventsInput>
  }

  export type EventsTypesUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsTypesUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsUpsertWithWhereUniqueWithoutEventInput = {
    where: ProgramsWhereUniqueInput
    update: XOR<ProgramsUpdateWithoutEventInput, ProgramsUncheckedUpdateWithoutEventInput>
    create: XOR<ProgramsCreateWithoutEventInput, ProgramsUncheckedCreateWithoutEventInput>
  }

  export type ProgramsUpdateWithWhereUniqueWithoutEventInput = {
    where: ProgramsWhereUniqueInput
    data: XOR<ProgramsUpdateWithoutEventInput, ProgramsUncheckedUpdateWithoutEventInput>
  }

  export type ProgramsUpdateManyWithWhereWithoutEventInput = {
    where: ProgramsScalarWhereInput
    data: XOR<ProgramsUpdateManyMutationInput, ProgramsUncheckedUpdateManyWithoutEventInput>
  }

  export type ProgramsScalarWhereInput = {
    AND?: ProgramsScalarWhereInput | ProgramsScalarWhereInput[]
    OR?: ProgramsScalarWhereInput[]
    NOT?: ProgramsScalarWhereInput | ProgramsScalarWhereInput[]
    id?: StringFilter<"Programs"> | string
    startTime?: DateTimeFilter<"Programs"> | Date | string
    endTime?: DateTimeFilter<"Programs"> | Date | string
    eventId?: StringFilter<"Programs"> | string
    createdAt?: DateTimeFilter<"Programs"> | Date | string
    updatedAt?: DateTimeFilter<"Programs"> | Date | string
  }

  export type ArtistsUpsertWithWhereUniqueWithoutEventInput = {
    where: ArtistsWhereUniqueInput
    update: XOR<ArtistsUpdateWithoutEventInput, ArtistsUncheckedUpdateWithoutEventInput>
    create: XOR<ArtistsCreateWithoutEventInput, ArtistsUncheckedCreateWithoutEventInput>
  }

  export type ArtistsUpdateWithWhereUniqueWithoutEventInput = {
    where: ArtistsWhereUniqueInput
    data: XOR<ArtistsUpdateWithoutEventInput, ArtistsUncheckedUpdateWithoutEventInput>
  }

  export type ArtistsUpdateManyWithWhereWithoutEventInput = {
    where: ArtistsScalarWhereInput
    data: XOR<ArtistsUpdateManyMutationInput, ArtistsUncheckedUpdateManyWithoutEventInput>
  }

  export type ArtistsScalarWhereInput = {
    AND?: ArtistsScalarWhereInput | ArtistsScalarWhereInput[]
    OR?: ArtistsScalarWhereInput[]
    NOT?: ArtistsScalarWhereInput | ArtistsScalarWhereInput[]
    id?: StringFilter<"Artists"> | string
    name?: StringFilter<"Artists"> | string
    eventId?: StringFilter<"Artists"> | string
    createdAt?: DateTimeFilter<"Artists"> | Date | string
    updatedAt?: DateTimeFilter<"Artists"> | Date | string
  }

  export type QuizUpsertWithWhereUniqueWithoutEventInput = {
    where: QuizWhereUniqueInput
    update: XOR<QuizUpdateWithoutEventInput, QuizUncheckedUpdateWithoutEventInput>
    create: XOR<QuizCreateWithoutEventInput, QuizUncheckedCreateWithoutEventInput>
  }

  export type QuizUpdateWithWhereUniqueWithoutEventInput = {
    where: QuizWhereUniqueInput
    data: XOR<QuizUpdateWithoutEventInput, QuizUncheckedUpdateWithoutEventInput>
  }

  export type QuizUpdateManyWithWhereWithoutEventInput = {
    where: QuizScalarWhereInput
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyWithoutEventInput>
  }

  export type QuizScalarWhereInput = {
    AND?: QuizScalarWhereInput | QuizScalarWhereInput[]
    OR?: QuizScalarWhereInput[]
    NOT?: QuizScalarWhereInput | QuizScalarWhereInput[]
    id?: StringFilter<"Quiz"> | string
    title?: StringFilter<"Quiz"> | string
    description?: StringNullableFilter<"Quiz"> | string | null
    active?: BoolFilter<"Quiz"> | boolean
    eventId?: StringFilter<"Quiz"> | string
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
  }

  export type EventsCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutEventsInput
    eventType: EventsTypesCreateNestedOneWithoutEventsInput
    artists?: ArtistsCreateNestedManyWithoutEventInput
    quizzes?: QuizCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    artists?: ArtistsUncheckedCreateNestedManyWithoutEventInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsCreateOrConnectWithoutProgramsInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutProgramsInput, EventsUncheckedCreateWithoutProgramsInput>
  }

  export type EventsUpsertWithoutProgramsInput = {
    update: XOR<EventsUpdateWithoutProgramsInput, EventsUncheckedUpdateWithoutProgramsInput>
    create: XOR<EventsCreateWithoutProgramsInput, EventsUncheckedCreateWithoutProgramsInput>
    where?: EventsWhereInput
  }

  export type EventsUpdateToOneWithWhereWithoutProgramsInput = {
    where?: EventsWhereInput
    data: XOR<EventsUpdateWithoutProgramsInput, EventsUncheckedUpdateWithoutProgramsInput>
  }

  export type EventsUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutEventsNestedInput
    eventType?: EventsTypesUpdateOneRequiredWithoutEventsNestedInput
    artists?: ArtistsUpdateManyWithoutEventNestedInput
    quizzes?: QuizUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    artists?: ArtistsUncheckedUpdateManyWithoutEventNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventsCreateWithoutArtistsInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutEventsInput
    eventType: EventsTypesCreateNestedOneWithoutEventsInput
    programs?: ProgramsCreateNestedManyWithoutEventInput
    quizzes?: QuizCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateWithoutArtistsInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramsUncheckedCreateNestedManyWithoutEventInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsCreateOrConnectWithoutArtistsInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutArtistsInput, EventsUncheckedCreateWithoutArtistsInput>
  }

  export type EventsUpsertWithoutArtistsInput = {
    update: XOR<EventsUpdateWithoutArtistsInput, EventsUncheckedUpdateWithoutArtistsInput>
    create: XOR<EventsCreateWithoutArtistsInput, EventsUncheckedCreateWithoutArtistsInput>
    where?: EventsWhereInput
  }

  export type EventsUpdateToOneWithWhereWithoutArtistsInput = {
    where?: EventsWhereInput
    data: XOR<EventsUpdateWithoutArtistsInput, EventsUncheckedUpdateWithoutArtistsInput>
  }

  export type EventsUpdateWithoutArtistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutEventsNestedInput
    eventType?: EventsTypesUpdateOneRequiredWithoutEventsNestedInput
    programs?: ProgramsUpdateManyWithoutEventNestedInput
    quizzes?: QuizUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateWithoutArtistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramsUncheckedUpdateManyWithoutEventNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventsCreateWithoutQuizzesInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    site: SitesCreateNestedOneWithoutEventsInput
    eventType: EventsTypesCreateNestedOneWithoutEventsInput
    programs?: ProgramsCreateNestedManyWithoutEventInput
    artists?: ArtistsCreateNestedManyWithoutEventInput
  }

  export type EventsUncheckedCreateWithoutQuizzesInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramsUncheckedCreateNestedManyWithoutEventInput
    artists?: ArtistsUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventsCreateOrConnectWithoutQuizzesInput = {
    where: EventsWhereUniqueInput
    create: XOR<EventsCreateWithoutQuizzesInput, EventsUncheckedCreateWithoutQuizzesInput>
  }

  export type QuestionsCreateWithoutQuizInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questionType: QuestionsTypesCreateNestedOneWithoutQuestionsInput
    impressions?: Questions_impressionsCreateNestedManyWithoutQuestionInput
    choices?: ChoicesCreateNestedManyWithoutQuestionInput
    answers?: AnswersCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateWithoutQuizInput = {
    id?: string
    wording: string
    questionTypeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    impressions?: Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput
    choices?: ChoicesUncheckedCreateNestedManyWithoutQuestionInput
    answers?: AnswersUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsCreateOrConnectWithoutQuizInput = {
    where: QuestionsWhereUniqueInput
    create: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput>
  }

  export type QuestionsCreateManyQuizInputEnvelope = {
    data: QuestionsCreateManyQuizInput | QuestionsCreateManyQuizInput[]
    skipDuplicates?: boolean
  }

  export type EventsUpsertWithoutQuizzesInput = {
    update: XOR<EventsUpdateWithoutQuizzesInput, EventsUncheckedUpdateWithoutQuizzesInput>
    create: XOR<EventsCreateWithoutQuizzesInput, EventsUncheckedCreateWithoutQuizzesInput>
    where?: EventsWhereInput
  }

  export type EventsUpdateToOneWithWhereWithoutQuizzesInput = {
    where?: EventsWhereInput
    data: XOR<EventsUpdateWithoutQuizzesInput, EventsUncheckedUpdateWithoutQuizzesInput>
  }

  export type EventsUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutEventsNestedInput
    eventType?: EventsTypesUpdateOneRequiredWithoutEventsNestedInput
    programs?: ProgramsUpdateManyWithoutEventNestedInput
    artists?: ArtistsUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramsUncheckedUpdateManyWithoutEventNestedInput
    artists?: ArtistsUncheckedUpdateManyWithoutEventNestedInput
  }

  export type QuestionsUpsertWithWhereUniqueWithoutQuizInput = {
    where: QuestionsWhereUniqueInput
    update: XOR<QuestionsUpdateWithoutQuizInput, QuestionsUncheckedUpdateWithoutQuizInput>
    create: XOR<QuestionsCreateWithoutQuizInput, QuestionsUncheckedCreateWithoutQuizInput>
  }

  export type QuestionsUpdateWithWhereUniqueWithoutQuizInput = {
    where: QuestionsWhereUniqueInput
    data: XOR<QuestionsUpdateWithoutQuizInput, QuestionsUncheckedUpdateWithoutQuizInput>
  }

  export type QuestionsUpdateManyWithWhereWithoutQuizInput = {
    where: QuestionsScalarWhereInput
    data: XOR<QuestionsUpdateManyMutationInput, QuestionsUncheckedUpdateManyWithoutQuizInput>
  }

  export type QuestionsScalarWhereInput = {
    AND?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
    OR?: QuestionsScalarWhereInput[]
    NOT?: QuestionsScalarWhereInput | QuestionsScalarWhereInput[]
    id?: StringFilter<"Questions"> | string
    wording?: StringFilter<"Questions"> | string
    questionTypeId?: StringFilter<"Questions"> | string
    quizId?: StringFilter<"Questions"> | string
    createdAt?: DateTimeFilter<"Questions"> | Date | string
    updatedAt?: DateTimeFilter<"Questions"> | Date | string
  }

  export type QuestionsCreateWithoutQuestionTypeInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    quiz: QuizCreateNestedOneWithoutQuestionsInput
    impressions?: Questions_impressionsCreateNestedManyWithoutQuestionInput
    choices?: ChoicesCreateNestedManyWithoutQuestionInput
    answers?: AnswersCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateWithoutQuestionTypeInput = {
    id?: string
    wording: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    impressions?: Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput
    choices?: ChoicesUncheckedCreateNestedManyWithoutQuestionInput
    answers?: AnswersUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsCreateOrConnectWithoutQuestionTypeInput = {
    where: QuestionsWhereUniqueInput
    create: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput>
  }

  export type QuestionsCreateManyQuestionTypeInputEnvelope = {
    data: QuestionsCreateManyQuestionTypeInput | QuestionsCreateManyQuestionTypeInput[]
    skipDuplicates?: boolean
  }

  export type QuestionsUpsertWithWhereUniqueWithoutQuestionTypeInput = {
    where: QuestionsWhereUniqueInput
    update: XOR<QuestionsUpdateWithoutQuestionTypeInput, QuestionsUncheckedUpdateWithoutQuestionTypeInput>
    create: XOR<QuestionsCreateWithoutQuestionTypeInput, QuestionsUncheckedCreateWithoutQuestionTypeInput>
  }

  export type QuestionsUpdateWithWhereUniqueWithoutQuestionTypeInput = {
    where: QuestionsWhereUniqueInput
    data: XOR<QuestionsUpdateWithoutQuestionTypeInput, QuestionsUncheckedUpdateWithoutQuestionTypeInput>
  }

  export type QuestionsUpdateManyWithWhereWithoutQuestionTypeInput = {
    where: QuestionsScalarWhereInput
    data: XOR<QuestionsUpdateManyMutationInput, QuestionsUncheckedUpdateManyWithoutQuestionTypeInput>
  }

  export type QuestionsTypesCreateWithoutQuestionsInput = {
    id?: string
    types: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsTypesUncheckedCreateWithoutQuestionsInput = {
    id?: string
    types: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsTypesCreateOrConnectWithoutQuestionsInput = {
    where: QuestionsTypesWhereUniqueInput
    create: XOR<QuestionsTypesCreateWithoutQuestionsInput, QuestionsTypesUncheckedCreateWithoutQuestionsInput>
  }

  export type QuizCreateWithoutQuestionsInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventsCreateNestedOneWithoutQuizzesInput
  }

  export type QuizUncheckedCreateWithoutQuestionsInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    eventId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizCreateOrConnectWithoutQuestionsInput = {
    where: QuizWhereUniqueInput
    create: XOR<QuizCreateWithoutQuestionsInput, QuizUncheckedCreateWithoutQuestionsInput>
  }

  export type Questions_impressionsCreateWithoutQuestionInput = {
    impression: ImpressionsCreateNestedOneWithoutQuestionsInput
  }

  export type Questions_impressionsUncheckedCreateWithoutQuestionInput = {
    impressionId: string
  }

  export type Questions_impressionsCreateOrConnectWithoutQuestionInput = {
    where: Questions_impressionsWhereUniqueInput
    create: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput>
  }

  export type Questions_impressionsCreateManyQuestionInputEnvelope = {
    data: Questions_impressionsCreateManyQuestionInput | Questions_impressionsCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type ChoicesCreateWithoutQuestionInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChoicesUncheckedCreateWithoutQuestionInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChoicesCreateOrConnectWithoutQuestionInput = {
    where: ChoicesWhereUniqueInput
    create: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput>
  }

  export type ChoicesCreateManyQuestionInputEnvelope = {
    data: ChoicesCreateManyQuestionInput | ChoicesCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type AnswersCreateWithoutQuestionInput = {
    id?: string
    uuid?: string
    response: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnswersUncheckedCreateWithoutQuestionInput = {
    id?: string
    uuid?: string
    response: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnswersCreateOrConnectWithoutQuestionInput = {
    where: AnswersWhereUniqueInput
    create: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput>
  }

  export type AnswersCreateManyQuestionInputEnvelope = {
    data: AnswersCreateManyQuestionInput | AnswersCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type QuestionsTypesUpsertWithoutQuestionsInput = {
    update: XOR<QuestionsTypesUpdateWithoutQuestionsInput, QuestionsTypesUncheckedUpdateWithoutQuestionsInput>
    create: XOR<QuestionsTypesCreateWithoutQuestionsInput, QuestionsTypesUncheckedCreateWithoutQuestionsInput>
    where?: QuestionsTypesWhereInput
  }

  export type QuestionsTypesUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: QuestionsTypesWhereInput
    data: XOR<QuestionsTypesUpdateWithoutQuestionsInput, QuestionsTypesUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuestionsTypesUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsTypesUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    types?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUpsertWithoutQuestionsInput = {
    update: XOR<QuizUpdateWithoutQuestionsInput, QuizUncheckedUpdateWithoutQuestionsInput>
    create: XOR<QuizCreateWithoutQuestionsInput, QuizUncheckedCreateWithoutQuestionsInput>
    where?: QuizWhereInput
  }

  export type QuizUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: QuizWhereInput
    data: XOR<QuizUpdateWithoutQuestionsInput, QuizUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuizUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventsUpdateOneRequiredWithoutQuizzesNestedInput
  }

  export type QuizUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Questions_impressionsUpsertWithWhereUniqueWithoutQuestionInput = {
    where: Questions_impressionsWhereUniqueInput
    update: XOR<Questions_impressionsUpdateWithoutQuestionInput, Questions_impressionsUncheckedUpdateWithoutQuestionInput>
    create: XOR<Questions_impressionsCreateWithoutQuestionInput, Questions_impressionsUncheckedCreateWithoutQuestionInput>
  }

  export type Questions_impressionsUpdateWithWhereUniqueWithoutQuestionInput = {
    where: Questions_impressionsWhereUniqueInput
    data: XOR<Questions_impressionsUpdateWithoutQuestionInput, Questions_impressionsUncheckedUpdateWithoutQuestionInput>
  }

  export type Questions_impressionsUpdateManyWithWhereWithoutQuestionInput = {
    where: Questions_impressionsScalarWhereInput
    data: XOR<Questions_impressionsUpdateManyMutationInput, Questions_impressionsUncheckedUpdateManyWithoutQuestionInput>
  }

  export type Questions_impressionsScalarWhereInput = {
    AND?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
    OR?: Questions_impressionsScalarWhereInput[]
    NOT?: Questions_impressionsScalarWhereInput | Questions_impressionsScalarWhereInput[]
    questionId?: StringFilter<"Questions_impressions"> | string
    impressionId?: StringFilter<"Questions_impressions"> | string
  }

  export type ChoicesUpsertWithWhereUniqueWithoutQuestionInput = {
    where: ChoicesWhereUniqueInput
    update: XOR<ChoicesUpdateWithoutQuestionInput, ChoicesUncheckedUpdateWithoutQuestionInput>
    create: XOR<ChoicesCreateWithoutQuestionInput, ChoicesUncheckedCreateWithoutQuestionInput>
  }

  export type ChoicesUpdateWithWhereUniqueWithoutQuestionInput = {
    where: ChoicesWhereUniqueInput
    data: XOR<ChoicesUpdateWithoutQuestionInput, ChoicesUncheckedUpdateWithoutQuestionInput>
  }

  export type ChoicesUpdateManyWithWhereWithoutQuestionInput = {
    where: ChoicesScalarWhereInput
    data: XOR<ChoicesUpdateManyMutationInput, ChoicesUncheckedUpdateManyWithoutQuestionInput>
  }

  export type ChoicesScalarWhereInput = {
    AND?: ChoicesScalarWhereInput | ChoicesScalarWhereInput[]
    OR?: ChoicesScalarWhereInput[]
    NOT?: ChoicesScalarWhereInput | ChoicesScalarWhereInput[]
    id?: StringFilter<"Choices"> | string
    wording?: StringFilter<"Choices"> | string
    questionId?: StringFilter<"Choices"> | string
    createdAt?: DateTimeFilter<"Choices"> | Date | string
    updatedAt?: DateTimeFilter<"Choices"> | Date | string
  }

  export type AnswersUpsertWithWhereUniqueWithoutQuestionInput = {
    where: AnswersWhereUniqueInput
    update: XOR<AnswersUpdateWithoutQuestionInput, AnswersUncheckedUpdateWithoutQuestionInput>
    create: XOR<AnswersCreateWithoutQuestionInput, AnswersUncheckedCreateWithoutQuestionInput>
  }

  export type AnswersUpdateWithWhereUniqueWithoutQuestionInput = {
    where: AnswersWhereUniqueInput
    data: XOR<AnswersUpdateWithoutQuestionInput, AnswersUncheckedUpdateWithoutQuestionInput>
  }

  export type AnswersUpdateManyWithWhereWithoutQuestionInput = {
    where: AnswersScalarWhereInput
    data: XOR<AnswersUpdateManyMutationInput, AnswersUncheckedUpdateManyWithoutQuestionInput>
  }

  export type AnswersScalarWhereInput = {
    AND?: AnswersScalarWhereInput | AnswersScalarWhereInput[]
    OR?: AnswersScalarWhereInput[]
    NOT?: AnswersScalarWhereInput | AnswersScalarWhereInput[]
    id?: StringFilter<"Answers"> | string
    uuid?: StringFilter<"Answers"> | string
    response?: StringFilter<"Answers"> | string
    questionId?: StringFilter<"Answers"> | string
    createdAt?: DateTimeFilter<"Answers"> | Date | string
    updatedAt?: DateTimeFilter<"Answers"> | Date | string
  }

  export type Questions_impressionsCreateWithoutImpressionInput = {
    question: QuestionsCreateNestedOneWithoutImpressionsInput
  }

  export type Questions_impressionsUncheckedCreateWithoutImpressionInput = {
    questionId: string
  }

  export type Questions_impressionsCreateOrConnectWithoutImpressionInput = {
    where: Questions_impressionsWhereUniqueInput
    create: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput>
  }

  export type Questions_impressionsCreateManyImpressionInputEnvelope = {
    data: Questions_impressionsCreateManyImpressionInput | Questions_impressionsCreateManyImpressionInput[]
    skipDuplicates?: boolean
  }

  export type Questions_impressionsUpsertWithWhereUniqueWithoutImpressionInput = {
    where: Questions_impressionsWhereUniqueInput
    update: XOR<Questions_impressionsUpdateWithoutImpressionInput, Questions_impressionsUncheckedUpdateWithoutImpressionInput>
    create: XOR<Questions_impressionsCreateWithoutImpressionInput, Questions_impressionsUncheckedCreateWithoutImpressionInput>
  }

  export type Questions_impressionsUpdateWithWhereUniqueWithoutImpressionInput = {
    where: Questions_impressionsWhereUniqueInput
    data: XOR<Questions_impressionsUpdateWithoutImpressionInput, Questions_impressionsUncheckedUpdateWithoutImpressionInput>
  }

  export type Questions_impressionsUpdateManyWithWhereWithoutImpressionInput = {
    where: Questions_impressionsScalarWhereInput
    data: XOR<Questions_impressionsUpdateManyMutationInput, Questions_impressionsUncheckedUpdateManyWithoutImpressionInput>
  }

  export type QuestionsCreateWithoutImpressionsInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questionType: QuestionsTypesCreateNestedOneWithoutQuestionsInput
    quiz: QuizCreateNestedOneWithoutQuestionsInput
    choices?: ChoicesCreateNestedManyWithoutQuestionInput
    answers?: AnswersCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateWithoutImpressionsInput = {
    id?: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    choices?: ChoicesUncheckedCreateNestedManyWithoutQuestionInput
    answers?: AnswersUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsCreateOrConnectWithoutImpressionsInput = {
    where: QuestionsWhereUniqueInput
    create: XOR<QuestionsCreateWithoutImpressionsInput, QuestionsUncheckedCreateWithoutImpressionsInput>
  }

  export type ImpressionsCreateWithoutQuestionsInput = {
    id?: string
    name: string
    emoji: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImpressionsUncheckedCreateWithoutQuestionsInput = {
    id?: string
    name: string
    emoji: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImpressionsCreateOrConnectWithoutQuestionsInput = {
    where: ImpressionsWhereUniqueInput
    create: XOR<ImpressionsCreateWithoutQuestionsInput, ImpressionsUncheckedCreateWithoutQuestionsInput>
  }

  export type QuestionsUpsertWithoutImpressionsInput = {
    update: XOR<QuestionsUpdateWithoutImpressionsInput, QuestionsUncheckedUpdateWithoutImpressionsInput>
    create: XOR<QuestionsCreateWithoutImpressionsInput, QuestionsUncheckedCreateWithoutImpressionsInput>
    where?: QuestionsWhereInput
  }

  export type QuestionsUpdateToOneWithWhereWithoutImpressionsInput = {
    where?: QuestionsWhereInput
    data: XOR<QuestionsUpdateWithoutImpressionsInput, QuestionsUncheckedUpdateWithoutImpressionsInput>
  }

  export type QuestionsUpdateWithoutImpressionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questionType?: QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput
    quiz?: QuizUpdateOneRequiredWithoutQuestionsNestedInput
    choices?: ChoicesUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateWithoutImpressionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    choices?: ChoicesUncheckedUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type ImpressionsUpsertWithoutQuestionsInput = {
    update: XOR<ImpressionsUpdateWithoutQuestionsInput, ImpressionsUncheckedUpdateWithoutQuestionsInput>
    create: XOR<ImpressionsCreateWithoutQuestionsInput, ImpressionsUncheckedCreateWithoutQuestionsInput>
    where?: ImpressionsWhereInput
  }

  export type ImpressionsUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: ImpressionsWhereInput
    data: XOR<ImpressionsUpdateWithoutQuestionsInput, ImpressionsUncheckedUpdateWithoutQuestionsInput>
  }

  export type ImpressionsUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImpressionsUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    emoji?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsCreateWithoutChoicesInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questionType: QuestionsTypesCreateNestedOneWithoutQuestionsInput
    quiz: QuizCreateNestedOneWithoutQuestionsInput
    impressions?: Questions_impressionsCreateNestedManyWithoutQuestionInput
    answers?: AnswersCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateWithoutChoicesInput = {
    id?: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    impressions?: Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput
    answers?: AnswersUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsCreateOrConnectWithoutChoicesInput = {
    where: QuestionsWhereUniqueInput
    create: XOR<QuestionsCreateWithoutChoicesInput, QuestionsUncheckedCreateWithoutChoicesInput>
  }

  export type QuestionsUpsertWithoutChoicesInput = {
    update: XOR<QuestionsUpdateWithoutChoicesInput, QuestionsUncheckedUpdateWithoutChoicesInput>
    create: XOR<QuestionsCreateWithoutChoicesInput, QuestionsUncheckedCreateWithoutChoicesInput>
    where?: QuestionsWhereInput
  }

  export type QuestionsUpdateToOneWithWhereWithoutChoicesInput = {
    where?: QuestionsWhereInput
    data: XOR<QuestionsUpdateWithoutChoicesInput, QuestionsUncheckedUpdateWithoutChoicesInput>
  }

  export type QuestionsUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questionType?: QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput
    quiz?: QuizUpdateOneRequiredWithoutQuestionsNestedInput
    impressions?: Questions_impressionsUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateWithoutChoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impressions?: Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsCreateWithoutAnswersInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
    questionType: QuestionsTypesCreateNestedOneWithoutQuestionsInput
    quiz: QuizCreateNestedOneWithoutQuestionsInput
    impressions?: Questions_impressionsCreateNestedManyWithoutQuestionInput
    choices?: ChoicesCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsUncheckedCreateWithoutAnswersInput = {
    id?: string
    wording: string
    questionTypeId: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    impressions?: Questions_impressionsUncheckedCreateNestedManyWithoutQuestionInput
    choices?: ChoicesUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionsCreateOrConnectWithoutAnswersInput = {
    where: QuestionsWhereUniqueInput
    create: XOR<QuestionsCreateWithoutAnswersInput, QuestionsUncheckedCreateWithoutAnswersInput>
  }

  export type QuestionsUpsertWithoutAnswersInput = {
    update: XOR<QuestionsUpdateWithoutAnswersInput, QuestionsUncheckedUpdateWithoutAnswersInput>
    create: XOR<QuestionsCreateWithoutAnswersInput, QuestionsUncheckedCreateWithoutAnswersInput>
    where?: QuestionsWhereInput
  }

  export type QuestionsUpdateToOneWithWhereWithoutAnswersInput = {
    where?: QuestionsWhereInput
    data: XOR<QuestionsUpdateWithoutAnswersInput, QuestionsUncheckedUpdateWithoutAnswersInput>
  }

  export type QuestionsUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questionType?: QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput
    quiz?: QuizUpdateOneRequiredWithoutQuestionsNestedInput
    impressions?: Questions_impressionsUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impressions?: Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type AmenitiesCreateManySiteInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsCreateManySiteInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    eventTypeId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AmenitiesUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmenitiesUncheckedUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AmenitiesUncheckedUpdateManyWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: EventsTypesUpdateOneRequiredWithoutEventsNestedInput
    programs?: ProgramsUpdateManyWithoutEventNestedInput
    artists?: ArtistsUpdateManyWithoutEventNestedInput
    quizzes?: QuizUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramsUncheckedUpdateManyWithoutEventNestedInput
    artists?: ArtistsUncheckedUpdateManyWithoutEventNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateManyWithoutSiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventsCreateManyEventTypeInput = {
    id?: string
    name: string
    description?: string | null
    status: string
    siteId: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventsUpdateWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    site?: SitesUpdateOneRequiredWithoutEventsNestedInput
    programs?: ProgramsUpdateManyWithoutEventNestedInput
    artists?: ArtistsUpdateManyWithoutEventNestedInput
    quizzes?: QuizUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramsUncheckedUpdateManyWithoutEventNestedInput
    artists?: ArtistsUncheckedUpdateManyWithoutEventNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventsUncheckedUpdateManyWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    siteId?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsCreateManyEventInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArtistsCreateManyEventInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizCreateManyEventInput = {
    id?: string
    title: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramsUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramsUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArtistsUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuestionsUpdateManyWithoutQuizNestedInput
  }

  export type QuizUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuestionsUncheckedUpdateManyWithoutQuizNestedInput
  }

  export type QuizUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsCreateManyQuizInput = {
    id?: string
    wording: string
    questionTypeId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questionType?: QuestionsTypesUpdateOneRequiredWithoutQuestionsNestedInput
    impressions?: Questions_impressionsUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impressions?: Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUncheckedUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateManyWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    questionTypeId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionsCreateManyQuestionTypeInput = {
    id?: string
    wording: string
    quizId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuestionsUpdateWithoutQuestionTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quiz?: QuizUpdateOneRequiredWithoutQuestionsNestedInput
    impressions?: Questions_impressionsUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateWithoutQuestionTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impressions?: Questions_impressionsUncheckedUpdateManyWithoutQuestionNestedInput
    choices?: ChoicesUncheckedUpdateManyWithoutQuestionNestedInput
    answers?: AnswersUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionsUncheckedUpdateManyWithoutQuestionTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Questions_impressionsCreateManyQuestionInput = {
    impressionId: string
  }

  export type ChoicesCreateManyQuestionInput = {
    id?: string
    wording: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnswersCreateManyQuestionInput = {
    id?: string
    uuid?: string
    response: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type Questions_impressionsUpdateWithoutQuestionInput = {
    impression?: ImpressionsUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type Questions_impressionsUncheckedUpdateWithoutQuestionInput = {
    impressionId?: StringFieldUpdateOperationsInput | string
  }

  export type Questions_impressionsUncheckedUpdateManyWithoutQuestionInput = {
    impressionId?: StringFieldUpdateOperationsInput | string
  }

  export type ChoicesUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChoicesUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChoicesUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    wording?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnswersUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    response?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Questions_impressionsCreateManyImpressionInput = {
    questionId: string
  }

  export type Questions_impressionsUpdateWithoutImpressionInput = {
    question?: QuestionsUpdateOneRequiredWithoutImpressionsNestedInput
  }

  export type Questions_impressionsUncheckedUpdateWithoutImpressionInput = {
    questionId?: StringFieldUpdateOperationsInput | string
  }

  export type Questions_impressionsUncheckedUpdateManyWithoutImpressionInput = {
    questionId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}