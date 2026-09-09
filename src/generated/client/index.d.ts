
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model GuildConfig
 * 
 */
export type GuildConfig = $Result.DefaultSelection<Prisma.$GuildConfigPayload>
/**
 * Model AiConversation
 * 
 */
export type AiConversation = $Result.DefaultSelection<Prisma.$AiConversationPayload>
/**
 * Model AiMessage
 * 
 */
export type AiMessage = $Result.DefaultSelection<Prisma.$AiMessagePayload>
/**
 * Model UserLevel
 * 
 */
export type UserLevel = $Result.DefaultSelection<Prisma.$UserLevelPayload>
/**
 * Model UserEconomy
 * 
 */
export type UserEconomy = $Result.DefaultSelection<Prisma.$UserEconomyPayload>
/**
 * Model Warning
 * 
 */
export type Warning = $Result.DefaultSelection<Prisma.$WarningPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model AfkStatus
 * 
 */
export type AfkStatus = $Result.DefaultSelection<Prisma.$AfkStatusPayload>
/**
 * Model Reminder
 * 
 */
export type Reminder = $Result.DefaultSelection<Prisma.$ReminderPayload>
/**
 * Model Poll
 * 
 */
export type Poll = $Result.DefaultSelection<Prisma.$PollPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more GuildConfigs
 * const guildConfigs = await prisma.guildConfig.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more GuildConfigs
   * const guildConfigs = await prisma.guildConfig.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.guildConfig`: Exposes CRUD operations for the **GuildConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildConfigs
    * const guildConfigs = await prisma.guildConfig.findMany()
    * ```
    */
  get guildConfig(): Prisma.GuildConfigDelegate<ExtArgs>;

  /**
   * `prisma.aiConversation`: Exposes CRUD operations for the **AiConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiConversations
    * const aiConversations = await prisma.aiConversation.findMany()
    * ```
    */
  get aiConversation(): Prisma.AiConversationDelegate<ExtArgs>;

  /**
   * `prisma.aiMessage`: Exposes CRUD operations for the **AiMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiMessages
    * const aiMessages = await prisma.aiMessage.findMany()
    * ```
    */
  get aiMessage(): Prisma.AiMessageDelegate<ExtArgs>;

  /**
   * `prisma.userLevel`: Exposes CRUD operations for the **UserLevel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserLevels
    * const userLevels = await prisma.userLevel.findMany()
    * ```
    */
  get userLevel(): Prisma.UserLevelDelegate<ExtArgs>;

  /**
   * `prisma.userEconomy`: Exposes CRUD operations for the **UserEconomy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserEconomies
    * const userEconomies = await prisma.userEconomy.findMany()
    * ```
    */
  get userEconomy(): Prisma.UserEconomyDelegate<ExtArgs>;

  /**
   * `prisma.warning`: Exposes CRUD operations for the **Warning** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Warnings
    * const warnings = await prisma.warning.findMany()
    * ```
    */
  get warning(): Prisma.WarningDelegate<ExtArgs>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs>;

  /**
   * `prisma.afkStatus`: Exposes CRUD operations for the **AfkStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AfkStatuses
    * const afkStatuses = await prisma.afkStatus.findMany()
    * ```
    */
  get afkStatus(): Prisma.AfkStatusDelegate<ExtArgs>;

  /**
   * `prisma.reminder`: Exposes CRUD operations for the **Reminder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reminders
    * const reminders = await prisma.reminder.findMany()
    * ```
    */
  get reminder(): Prisma.ReminderDelegate<ExtArgs>;

  /**
   * `prisma.poll`: Exposes CRUD operations for the **Poll** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Polls
    * const polls = await prisma.poll.findMany()
    * ```
    */
  get poll(): Prisma.PollDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    GuildConfig: 'GuildConfig',
    AiConversation: 'AiConversation',
    AiMessage: 'AiMessage',
    UserLevel: 'UserLevel',
    UserEconomy: 'UserEconomy',
    Warning: 'Warning',
    Ticket: 'Ticket',
    AfkStatus: 'AfkStatus',
    Reminder: 'Reminder',
    Poll: 'Poll'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "guildConfig" | "aiConversation" | "aiMessage" | "userLevel" | "userEconomy" | "warning" | "ticket" | "afkStatus" | "reminder" | "poll"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      GuildConfig: {
        payload: Prisma.$GuildConfigPayload<ExtArgs>
        fields: Prisma.GuildConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          findFirst: {
            args: Prisma.GuildConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          findMany: {
            args: Prisma.GuildConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>[]
          }
          create: {
            args: Prisma.GuildConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          createMany: {
            args: Prisma.GuildConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>[]
          }
          delete: {
            args: Prisma.GuildConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          update: {
            args: Prisma.GuildConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          deleteMany: {
            args: Prisma.GuildConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GuildConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildConfigPayload>
          }
          aggregate: {
            args: Prisma.GuildConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildConfig>
          }
          groupBy: {
            args: Prisma.GuildConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildConfigCountArgs<ExtArgs>
            result: $Utils.Optional<GuildConfigCountAggregateOutputType> | number
          }
        }
      }
      AiConversation: {
        payload: Prisma.$AiConversationPayload<ExtArgs>
        fields: Prisma.AiConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          findFirst: {
            args: Prisma.AiConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          findMany: {
            args: Prisma.AiConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>[]
          }
          create: {
            args: Prisma.AiConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          createMany: {
            args: Prisma.AiConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>[]
          }
          delete: {
            args: Prisma.AiConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          update: {
            args: Prisma.AiConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          deleteMany: {
            args: Prisma.AiConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiConversationPayload>
          }
          aggregate: {
            args: Prisma.AiConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiConversation>
          }
          groupBy: {
            args: Prisma.AiConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiConversationCountArgs<ExtArgs>
            result: $Utils.Optional<AiConversationCountAggregateOutputType> | number
          }
        }
      }
      AiMessage: {
        payload: Prisma.$AiMessagePayload<ExtArgs>
        fields: Prisma.AiMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          findFirst: {
            args: Prisma.AiMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          findMany: {
            args: Prisma.AiMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>[]
          }
          create: {
            args: Prisma.AiMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          createMany: {
            args: Prisma.AiMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>[]
          }
          delete: {
            args: Prisma.AiMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          update: {
            args: Prisma.AiMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          deleteMany: {
            args: Prisma.AiMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AiMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          aggregate: {
            args: Prisma.AiMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiMessage>
          }
          groupBy: {
            args: Prisma.AiMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiMessageCountArgs<ExtArgs>
            result: $Utils.Optional<AiMessageCountAggregateOutputType> | number
          }
        }
      }
      UserLevel: {
        payload: Prisma.$UserLevelPayload<ExtArgs>
        fields: Prisma.UserLevelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLevelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLevelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          findFirst: {
            args: Prisma.UserLevelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLevelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          findMany: {
            args: Prisma.UserLevelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>[]
          }
          create: {
            args: Prisma.UserLevelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          createMany: {
            args: Prisma.UserLevelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserLevelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>[]
          }
          delete: {
            args: Prisma.UserLevelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          update: {
            args: Prisma.UserLevelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          deleteMany: {
            args: Prisma.UserLevelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLevelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserLevelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLevelPayload>
          }
          aggregate: {
            args: Prisma.UserLevelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLevel>
          }
          groupBy: {
            args: Prisma.UserLevelGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLevelGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserLevelCountArgs<ExtArgs>
            result: $Utils.Optional<UserLevelCountAggregateOutputType> | number
          }
        }
      }
      UserEconomy: {
        payload: Prisma.$UserEconomyPayload<ExtArgs>
        fields: Prisma.UserEconomyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserEconomyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserEconomyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          findFirst: {
            args: Prisma.UserEconomyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserEconomyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          findMany: {
            args: Prisma.UserEconomyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>[]
          }
          create: {
            args: Prisma.UserEconomyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          createMany: {
            args: Prisma.UserEconomyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserEconomyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>[]
          }
          delete: {
            args: Prisma.UserEconomyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          update: {
            args: Prisma.UserEconomyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          deleteMany: {
            args: Prisma.UserEconomyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserEconomyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserEconomyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserEconomyPayload>
          }
          aggregate: {
            args: Prisma.UserEconomyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserEconomy>
          }
          groupBy: {
            args: Prisma.UserEconomyGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserEconomyGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserEconomyCountArgs<ExtArgs>
            result: $Utils.Optional<UserEconomyCountAggregateOutputType> | number
          }
        }
      }
      Warning: {
        payload: Prisma.$WarningPayload<ExtArgs>
        fields: Prisma.WarningFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WarningFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WarningFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          findFirst: {
            args: Prisma.WarningFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WarningFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          findMany: {
            args: Prisma.WarningFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>[]
          }
          create: {
            args: Prisma.WarningCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          createMany: {
            args: Prisma.WarningCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WarningCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>[]
          }
          delete: {
            args: Prisma.WarningDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          update: {
            args: Prisma.WarningUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          deleteMany: {
            args: Prisma.WarningDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WarningUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WarningUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          aggregate: {
            args: Prisma.WarningAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWarning>
          }
          groupBy: {
            args: Prisma.WarningGroupByArgs<ExtArgs>
            result: $Utils.Optional<WarningGroupByOutputType>[]
          }
          count: {
            args: Prisma.WarningCountArgs<ExtArgs>
            result: $Utils.Optional<WarningCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      AfkStatus: {
        payload: Prisma.$AfkStatusPayload<ExtArgs>
        fields: Prisma.AfkStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AfkStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AfkStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          findFirst: {
            args: Prisma.AfkStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AfkStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          findMany: {
            args: Prisma.AfkStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>[]
          }
          create: {
            args: Prisma.AfkStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          createMany: {
            args: Prisma.AfkStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AfkStatusCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>[]
          }
          delete: {
            args: Prisma.AfkStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          update: {
            args: Prisma.AfkStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          deleteMany: {
            args: Prisma.AfkStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AfkStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AfkStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AfkStatusPayload>
          }
          aggregate: {
            args: Prisma.AfkStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAfkStatus>
          }
          groupBy: {
            args: Prisma.AfkStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<AfkStatusGroupByOutputType>[]
          }
          count: {
            args: Prisma.AfkStatusCountArgs<ExtArgs>
            result: $Utils.Optional<AfkStatusCountAggregateOutputType> | number
          }
        }
      }
      Reminder: {
        payload: Prisma.$ReminderPayload<ExtArgs>
        fields: Prisma.ReminderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReminderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReminderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findFirst: {
            args: Prisma.ReminderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReminderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findMany: {
            args: Prisma.ReminderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>[]
          }
          create: {
            args: Prisma.ReminderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          createMany: {
            args: Prisma.ReminderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReminderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>[]
          }
          delete: {
            args: Prisma.ReminderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          update: {
            args: Prisma.ReminderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          deleteMany: {
            args: Prisma.ReminderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReminderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReminderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          aggregate: {
            args: Prisma.ReminderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReminder>
          }
          groupBy: {
            args: Prisma.ReminderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReminderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReminderCountArgs<ExtArgs>
            result: $Utils.Optional<ReminderCountAggregateOutputType> | number
          }
        }
      }
      Poll: {
        payload: Prisma.$PollPayload<ExtArgs>
        fields: Prisma.PollFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PollFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PollFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          findFirst: {
            args: Prisma.PollFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PollFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          findMany: {
            args: Prisma.PollFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>[]
          }
          create: {
            args: Prisma.PollCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          createMany: {
            args: Prisma.PollCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PollCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>[]
          }
          delete: {
            args: Prisma.PollDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          update: {
            args: Prisma.PollUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          deleteMany: {
            args: Prisma.PollDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PollUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PollUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PollPayload>
          }
          aggregate: {
            args: Prisma.PollAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePoll>
          }
          groupBy: {
            args: Prisma.PollGroupByArgs<ExtArgs>
            result: $Utils.Optional<PollGroupByOutputType>[]
          }
          count: {
            args: Prisma.PollCountArgs<ExtArgs>
            result: $Utils.Optional<PollCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type AiConversationCountOutputType
   */

  export type AiConversationCountOutputType = {
    messages: number
  }

  export type AiConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AiConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * AiConversationCountOutputType without action
   */
  export type AiConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversationCountOutputType
     */
    select?: AiConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AiConversationCountOutputType without action
   */
  export type AiConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model GuildConfig
   */

  export type AggregateGuildConfig = {
    _count: GuildConfigCountAggregateOutputType | null
    _avg: GuildConfigAvgAggregateOutputType | null
    _sum: GuildConfigSumAggregateOutputType | null
    _min: GuildConfigMinAggregateOutputType | null
    _max: GuildConfigMaxAggregateOutputType | null
  }

  export type GuildConfigAvgAggregateOutputType = {
    maxMentions: number | null
  }

  export type GuildConfigSumAggregateOutputType = {
    maxMentions: number | null
  }

  export type GuildConfigMinAggregateOutputType = {
    guildId: string | null
    welcomeChannelId: string | null
    welcomeMessage: string | null
    autoRoleId: string | null
    logChannelId: string | null
    githubChannelId: string | null
    aiChannelId: string | null
    antiInvite: boolean | null
    antiLinks: boolean | null
    antiSpam: boolean | null
    maxMentions: number | null
    blockedWords: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GuildConfigMaxAggregateOutputType = {
    guildId: string | null
    welcomeChannelId: string | null
    welcomeMessage: string | null
    autoRoleId: string | null
    logChannelId: string | null
    githubChannelId: string | null
    aiChannelId: string | null
    antiInvite: boolean | null
    antiLinks: boolean | null
    antiSpam: boolean | null
    maxMentions: number | null
    blockedWords: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GuildConfigCountAggregateOutputType = {
    guildId: number
    welcomeChannelId: number
    welcomeMessage: number
    autoRoleId: number
    logChannelId: number
    githubChannelId: number
    aiChannelId: number
    antiInvite: number
    antiLinks: number
    antiSpam: number
    maxMentions: number
    blockedWords: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GuildConfigAvgAggregateInputType = {
    maxMentions?: true
  }

  export type GuildConfigSumAggregateInputType = {
    maxMentions?: true
  }

  export type GuildConfigMinAggregateInputType = {
    guildId?: true
    welcomeChannelId?: true
    welcomeMessage?: true
    autoRoleId?: true
    logChannelId?: true
    githubChannelId?: true
    aiChannelId?: true
    antiInvite?: true
    antiLinks?: true
    antiSpam?: true
    maxMentions?: true
    blockedWords?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GuildConfigMaxAggregateInputType = {
    guildId?: true
    welcomeChannelId?: true
    welcomeMessage?: true
    autoRoleId?: true
    logChannelId?: true
    githubChannelId?: true
    aiChannelId?: true
    antiInvite?: true
    antiLinks?: true
    antiSpam?: true
    maxMentions?: true
    blockedWords?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GuildConfigCountAggregateInputType = {
    guildId?: true
    welcomeChannelId?: true
    welcomeMessage?: true
    autoRoleId?: true
    logChannelId?: true
    githubChannelId?: true
    aiChannelId?: true
    antiInvite?: true
    antiLinks?: true
    antiSpam?: true
    maxMentions?: true
    blockedWords?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GuildConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildConfig to aggregate.
     */
    where?: GuildConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildConfigs to fetch.
     */
    orderBy?: GuildConfigOrderByWithRelationInput | GuildConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildConfigs
    **/
    _count?: true | GuildConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildConfigMaxAggregateInputType
  }

  export type GetGuildConfigAggregateType<T extends GuildConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildConfig[P]>
      : GetScalarType<T[P], AggregateGuildConfig[P]>
  }




  export type GuildConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildConfigWhereInput
    orderBy?: GuildConfigOrderByWithAggregationInput | GuildConfigOrderByWithAggregationInput[]
    by: GuildConfigScalarFieldEnum[] | GuildConfigScalarFieldEnum
    having?: GuildConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildConfigCountAggregateInputType | true
    _avg?: GuildConfigAvgAggregateInputType
    _sum?: GuildConfigSumAggregateInputType
    _min?: GuildConfigMinAggregateInputType
    _max?: GuildConfigMaxAggregateInputType
  }

  export type GuildConfigGroupByOutputType = {
    guildId: string
    welcomeChannelId: string | null
    welcomeMessage: string | null
    autoRoleId: string | null
    logChannelId: string | null
    githubChannelId: string | null
    aiChannelId: string | null
    antiInvite: boolean
    antiLinks: boolean
    antiSpam: boolean
    maxMentions: number
    blockedWords: string
    createdAt: Date
    updatedAt: Date
    _count: GuildConfigCountAggregateOutputType | null
    _avg: GuildConfigAvgAggregateOutputType | null
    _sum: GuildConfigSumAggregateOutputType | null
    _min: GuildConfigMinAggregateOutputType | null
    _max: GuildConfigMaxAggregateOutputType | null
  }

  type GetGuildConfigGroupByPayload<T extends GuildConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildConfigGroupByOutputType[P]>
            : GetScalarType<T[P], GuildConfigGroupByOutputType[P]>
        }
      >
    >


  export type GuildConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    guildId?: boolean
    welcomeChannelId?: boolean
    welcomeMessage?: boolean
    autoRoleId?: boolean
    logChannelId?: boolean
    githubChannelId?: boolean
    aiChannelId?: boolean
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: boolean
    blockedWords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["guildConfig"]>

  export type GuildConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    guildId?: boolean
    welcomeChannelId?: boolean
    welcomeMessage?: boolean
    autoRoleId?: boolean
    logChannelId?: boolean
    githubChannelId?: boolean
    aiChannelId?: boolean
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: boolean
    blockedWords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["guildConfig"]>

  export type GuildConfigSelectScalar = {
    guildId?: boolean
    welcomeChannelId?: boolean
    welcomeMessage?: boolean
    autoRoleId?: boolean
    logChannelId?: boolean
    githubChannelId?: boolean
    aiChannelId?: boolean
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: boolean
    blockedWords?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $GuildConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      guildId: string
      welcomeChannelId: string | null
      welcomeMessage: string | null
      autoRoleId: string | null
      logChannelId: string | null
      githubChannelId: string | null
      aiChannelId: string | null
      antiInvite: boolean
      antiLinks: boolean
      antiSpam: boolean
      maxMentions: number
      blockedWords: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["guildConfig"]>
    composites: {}
  }

  type GuildConfigGetPayload<S extends boolean | null | undefined | GuildConfigDefaultArgs> = $Result.GetResult<Prisma.$GuildConfigPayload, S>

  type GuildConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GuildConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GuildConfigCountAggregateInputType | true
    }

  export interface GuildConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildConfig'], meta: { name: 'GuildConfig' } }
    /**
     * Find zero or one GuildConfig that matches the filter.
     * @param {GuildConfigFindUniqueArgs} args - Arguments to find a GuildConfig
     * @example
     * // Get one GuildConfig
     * const guildConfig = await prisma.guildConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildConfigFindUniqueArgs>(args: SelectSubset<T, GuildConfigFindUniqueArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GuildConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GuildConfigFindUniqueOrThrowArgs} args - Arguments to find a GuildConfig
     * @example
     * // Get one GuildConfig
     * const guildConfig = await prisma.guildConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GuildConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigFindFirstArgs} args - Arguments to find a GuildConfig
     * @example
     * // Get one GuildConfig
     * const guildConfig = await prisma.guildConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildConfigFindFirstArgs>(args?: SelectSubset<T, GuildConfigFindFirstArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GuildConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigFindFirstOrThrowArgs} args - Arguments to find a GuildConfig
     * @example
     * // Get one GuildConfig
     * const guildConfig = await prisma.guildConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GuildConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildConfigs
     * const guildConfigs = await prisma.guildConfig.findMany()
     * 
     * // Get first 10 GuildConfigs
     * const guildConfigs = await prisma.guildConfig.findMany({ take: 10 })
     * 
     * // Only select the `guildId`
     * const guildConfigWithGuildIdOnly = await prisma.guildConfig.findMany({ select: { guildId: true } })
     * 
     */
    findMany<T extends GuildConfigFindManyArgs>(args?: SelectSubset<T, GuildConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GuildConfig.
     * @param {GuildConfigCreateArgs} args - Arguments to create a GuildConfig.
     * @example
     * // Create one GuildConfig
     * const GuildConfig = await prisma.guildConfig.create({
     *   data: {
     *     // ... data to create a GuildConfig
     *   }
     * })
     * 
     */
    create<T extends GuildConfigCreateArgs>(args: SelectSubset<T, GuildConfigCreateArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GuildConfigs.
     * @param {GuildConfigCreateManyArgs} args - Arguments to create many GuildConfigs.
     * @example
     * // Create many GuildConfigs
     * const guildConfig = await prisma.guildConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildConfigCreateManyArgs>(args?: SelectSubset<T, GuildConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildConfigs and returns the data saved in the database.
     * @param {GuildConfigCreateManyAndReturnArgs} args - Arguments to create many GuildConfigs.
     * @example
     * // Create many GuildConfigs
     * const guildConfig = await prisma.guildConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildConfigs and only return the `guildId`
     * const guildConfigWithGuildIdOnly = await prisma.guildConfig.createManyAndReturn({ 
     *   select: { guildId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GuildConfig.
     * @param {GuildConfigDeleteArgs} args - Arguments to delete one GuildConfig.
     * @example
     * // Delete one GuildConfig
     * const GuildConfig = await prisma.guildConfig.delete({
     *   where: {
     *     // ... filter to delete one GuildConfig
     *   }
     * })
     * 
     */
    delete<T extends GuildConfigDeleteArgs>(args: SelectSubset<T, GuildConfigDeleteArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GuildConfig.
     * @param {GuildConfigUpdateArgs} args - Arguments to update one GuildConfig.
     * @example
     * // Update one GuildConfig
     * const guildConfig = await prisma.guildConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildConfigUpdateArgs>(args: SelectSubset<T, GuildConfigUpdateArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GuildConfigs.
     * @param {GuildConfigDeleteManyArgs} args - Arguments to filter GuildConfigs to delete.
     * @example
     * // Delete a few GuildConfigs
     * const { count } = await prisma.guildConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildConfigDeleteManyArgs>(args?: SelectSubset<T, GuildConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildConfigs
     * const guildConfig = await prisma.guildConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildConfigUpdateManyArgs>(args: SelectSubset<T, GuildConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GuildConfig.
     * @param {GuildConfigUpsertArgs} args - Arguments to update or create a GuildConfig.
     * @example
     * // Update or create a GuildConfig
     * const guildConfig = await prisma.guildConfig.upsert({
     *   create: {
     *     // ... data to create a GuildConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildConfig we want to update
     *   }
     * })
     */
    upsert<T extends GuildConfigUpsertArgs>(args: SelectSubset<T, GuildConfigUpsertArgs<ExtArgs>>): Prisma__GuildConfigClient<$Result.GetResult<Prisma.$GuildConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GuildConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigCountArgs} args - Arguments to filter GuildConfigs to count.
     * @example
     * // Count the number of GuildConfigs
     * const count = await prisma.guildConfig.count({
     *   where: {
     *     // ... the filter for the GuildConfigs we want to count
     *   }
     * })
    **/
    count<T extends GuildConfigCountArgs>(
      args?: Subset<T, GuildConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuildConfigAggregateArgs>(args: Subset<T, GuildConfigAggregateArgs>): Prisma.PrismaPromise<GetGuildConfigAggregateType<T>>

    /**
     * Group by GuildConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildConfigGroupByArgs} args - Group by arguments.
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
      T extends GuildConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildConfigGroupByArgs['orderBy'] }
        : { orderBy?: GuildConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuildConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildConfig model
   */
  readonly fields: GuildConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GuildConfig model
   */ 
  interface GuildConfigFieldRefs {
    readonly guildId: FieldRef<"GuildConfig", 'String'>
    readonly welcomeChannelId: FieldRef<"GuildConfig", 'String'>
    readonly welcomeMessage: FieldRef<"GuildConfig", 'String'>
    readonly autoRoleId: FieldRef<"GuildConfig", 'String'>
    readonly logChannelId: FieldRef<"GuildConfig", 'String'>
    readonly githubChannelId: FieldRef<"GuildConfig", 'String'>
    readonly aiChannelId: FieldRef<"GuildConfig", 'String'>
    readonly antiInvite: FieldRef<"GuildConfig", 'Boolean'>
    readonly antiLinks: FieldRef<"GuildConfig", 'Boolean'>
    readonly antiSpam: FieldRef<"GuildConfig", 'Boolean'>
    readonly maxMentions: FieldRef<"GuildConfig", 'Int'>
    readonly blockedWords: FieldRef<"GuildConfig", 'String'>
    readonly createdAt: FieldRef<"GuildConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"GuildConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuildConfig findUnique
   */
  export type GuildConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter, which GuildConfig to fetch.
     */
    where: GuildConfigWhereUniqueInput
  }

  /**
   * GuildConfig findUniqueOrThrow
   */
  export type GuildConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter, which GuildConfig to fetch.
     */
    where: GuildConfigWhereUniqueInput
  }

  /**
   * GuildConfig findFirst
   */
  export type GuildConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter, which GuildConfig to fetch.
     */
    where?: GuildConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildConfigs to fetch.
     */
    orderBy?: GuildConfigOrderByWithRelationInput | GuildConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildConfigs.
     */
    cursor?: GuildConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildConfigs.
     */
    distinct?: GuildConfigScalarFieldEnum | GuildConfigScalarFieldEnum[]
  }

  /**
   * GuildConfig findFirstOrThrow
   */
  export type GuildConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter, which GuildConfig to fetch.
     */
    where?: GuildConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildConfigs to fetch.
     */
    orderBy?: GuildConfigOrderByWithRelationInput | GuildConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildConfigs.
     */
    cursor?: GuildConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildConfigs.
     */
    distinct?: GuildConfigScalarFieldEnum | GuildConfigScalarFieldEnum[]
  }

  /**
   * GuildConfig findMany
   */
  export type GuildConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter, which GuildConfigs to fetch.
     */
    where?: GuildConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildConfigs to fetch.
     */
    orderBy?: GuildConfigOrderByWithRelationInput | GuildConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildConfigs.
     */
    cursor?: GuildConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildConfigs.
     */
    skip?: number
    distinct?: GuildConfigScalarFieldEnum | GuildConfigScalarFieldEnum[]
  }

  /**
   * GuildConfig create
   */
  export type GuildConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a GuildConfig.
     */
    data: XOR<GuildConfigCreateInput, GuildConfigUncheckedCreateInput>
  }

  /**
   * GuildConfig createMany
   */
  export type GuildConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildConfigs.
     */
    data: GuildConfigCreateManyInput | GuildConfigCreateManyInput[]
  }

  /**
   * GuildConfig createManyAndReturn
   */
  export type GuildConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GuildConfigs.
     */
    data: GuildConfigCreateManyInput | GuildConfigCreateManyInput[]
  }

  /**
   * GuildConfig update
   */
  export type GuildConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a GuildConfig.
     */
    data: XOR<GuildConfigUpdateInput, GuildConfigUncheckedUpdateInput>
    /**
     * Choose, which GuildConfig to update.
     */
    where: GuildConfigWhereUniqueInput
  }

  /**
   * GuildConfig updateMany
   */
  export type GuildConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildConfigs.
     */
    data: XOR<GuildConfigUpdateManyMutationInput, GuildConfigUncheckedUpdateManyInput>
    /**
     * Filter which GuildConfigs to update
     */
    where?: GuildConfigWhereInput
  }

  /**
   * GuildConfig upsert
   */
  export type GuildConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the GuildConfig to update in case it exists.
     */
    where: GuildConfigWhereUniqueInput
    /**
     * In case the GuildConfig found by the `where` argument doesn't exist, create a new GuildConfig with this data.
     */
    create: XOR<GuildConfigCreateInput, GuildConfigUncheckedCreateInput>
    /**
     * In case the GuildConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildConfigUpdateInput, GuildConfigUncheckedUpdateInput>
  }

  /**
   * GuildConfig delete
   */
  export type GuildConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
    /**
     * Filter which GuildConfig to delete.
     */
    where: GuildConfigWhereUniqueInput
  }

  /**
   * GuildConfig deleteMany
   */
  export type GuildConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildConfigs to delete
     */
    where?: GuildConfigWhereInput
  }

  /**
   * GuildConfig without action
   */
  export type GuildConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildConfig
     */
    select?: GuildConfigSelect<ExtArgs> | null
  }


  /**
   * Model AiConversation
   */

  export type AggregateAiConversation = {
    _count: AiConversationCountAggregateOutputType | null
    _min: AiConversationMinAggregateOutputType | null
    _max: AiConversationMaxAggregateOutputType | null
  }

  export type AiConversationMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiConversationMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiConversationCountAggregateOutputType = {
    id: number
    guildId: number
    channelId: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiConversationMinAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiConversationMaxAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiConversationCountAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversation to aggregate.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiConversations
    **/
    _count?: true | AiConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiConversationMaxAggregateInputType
  }

  export type GetAiConversationAggregateType<T extends AiConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateAiConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiConversation[P]>
      : GetScalarType<T[P], AggregateAiConversation[P]>
  }




  export type AiConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiConversationWhereInput
    orderBy?: AiConversationOrderByWithAggregationInput | AiConversationOrderByWithAggregationInput[]
    by: AiConversationScalarFieldEnum[] | AiConversationScalarFieldEnum
    having?: AiConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiConversationCountAggregateInputType | true
    _min?: AiConversationMinAggregateInputType
    _max?: AiConversationMaxAggregateInputType
  }

  export type AiConversationGroupByOutputType = {
    id: string
    guildId: string
    channelId: string
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: AiConversationCountAggregateOutputType | null
    _min: AiConversationMinAggregateOutputType | null
    _max: AiConversationMaxAggregateOutputType | null
  }

  type GetAiConversationGroupByPayload<T extends AiConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiConversationGroupByOutputType[P]>
            : GetScalarType<T[P], AiConversationGroupByOutputType[P]>
        }
      >
    >


  export type AiConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | AiConversation$messagesArgs<ExtArgs>
    _count?: boolean | AiConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiConversation"]>

  export type AiConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiConversation"]>

  export type AiConversationSelectScalar = {
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AiConversation$messagesArgs<ExtArgs>
    _count?: boolean | AiConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AiConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AiConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiConversation"
    objects: {
      messages: Prisma.$AiMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      channelId: string
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiConversation"]>
    composites: {}
  }

  type AiConversationGetPayload<S extends boolean | null | undefined | AiConversationDefaultArgs> = $Result.GetResult<Prisma.$AiConversationPayload, S>

  type AiConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiConversationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiConversationCountAggregateInputType | true
    }

  export interface AiConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiConversation'], meta: { name: 'AiConversation' } }
    /**
     * Find zero or one AiConversation that matches the filter.
     * @param {AiConversationFindUniqueArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiConversationFindUniqueArgs>(args: SelectSubset<T, AiConversationFindUniqueArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiConversation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiConversationFindUniqueOrThrowArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, AiConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindFirstArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiConversationFindFirstArgs>(args?: SelectSubset<T, AiConversationFindFirstArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindFirstOrThrowArgs} args - Arguments to find a AiConversation
     * @example
     * // Get one AiConversation
     * const aiConversation = await prisma.aiConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, AiConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiConversations
     * const aiConversations = await prisma.aiConversation.findMany()
     * 
     * // Get first 10 AiConversations
     * const aiConversations = await prisma.aiConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiConversationWithIdOnly = await prisma.aiConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiConversationFindManyArgs>(args?: SelectSubset<T, AiConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiConversation.
     * @param {AiConversationCreateArgs} args - Arguments to create a AiConversation.
     * @example
     * // Create one AiConversation
     * const AiConversation = await prisma.aiConversation.create({
     *   data: {
     *     // ... data to create a AiConversation
     *   }
     * })
     * 
     */
    create<T extends AiConversationCreateArgs>(args: SelectSubset<T, AiConversationCreateArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiConversations.
     * @param {AiConversationCreateManyArgs} args - Arguments to create many AiConversations.
     * @example
     * // Create many AiConversations
     * const aiConversation = await prisma.aiConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiConversationCreateManyArgs>(args?: SelectSubset<T, AiConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiConversations and returns the data saved in the database.
     * @param {AiConversationCreateManyAndReturnArgs} args - Arguments to create many AiConversations.
     * @example
     * // Create many AiConversations
     * const aiConversation = await prisma.aiConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiConversations and only return the `id`
     * const aiConversationWithIdOnly = await prisma.aiConversation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, AiConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiConversation.
     * @param {AiConversationDeleteArgs} args - Arguments to delete one AiConversation.
     * @example
     * // Delete one AiConversation
     * const AiConversation = await prisma.aiConversation.delete({
     *   where: {
     *     // ... filter to delete one AiConversation
     *   }
     * })
     * 
     */
    delete<T extends AiConversationDeleteArgs>(args: SelectSubset<T, AiConversationDeleteArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiConversation.
     * @param {AiConversationUpdateArgs} args - Arguments to update one AiConversation.
     * @example
     * // Update one AiConversation
     * const aiConversation = await prisma.aiConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiConversationUpdateArgs>(args: SelectSubset<T, AiConversationUpdateArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiConversations.
     * @param {AiConversationDeleteManyArgs} args - Arguments to filter AiConversations to delete.
     * @example
     * // Delete a few AiConversations
     * const { count } = await prisma.aiConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiConversationDeleteManyArgs>(args?: SelectSubset<T, AiConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiConversations
     * const aiConversation = await prisma.aiConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiConversationUpdateManyArgs>(args: SelectSubset<T, AiConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiConversation.
     * @param {AiConversationUpsertArgs} args - Arguments to update or create a AiConversation.
     * @example
     * // Update or create a AiConversation
     * const aiConversation = await prisma.aiConversation.upsert({
     *   create: {
     *     // ... data to create a AiConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiConversation we want to update
     *   }
     * })
     */
    upsert<T extends AiConversationUpsertArgs>(args: SelectSubset<T, AiConversationUpsertArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationCountArgs} args - Arguments to filter AiConversations to count.
     * @example
     * // Count the number of AiConversations
     * const count = await prisma.aiConversation.count({
     *   where: {
     *     // ... the filter for the AiConversations we want to count
     *   }
     * })
    **/
    count<T extends AiConversationCountArgs>(
      args?: Subset<T, AiConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiConversationAggregateArgs>(args: Subset<T, AiConversationAggregateArgs>): Prisma.PrismaPromise<GetAiConversationAggregateType<T>>

    /**
     * Group by AiConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiConversationGroupByArgs} args - Group by arguments.
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
      T extends AiConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiConversationGroupByArgs['orderBy'] }
        : { orderBy?: AiConversationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiConversation model
   */
  readonly fields: AiConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends AiConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, AiConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the AiConversation model
   */ 
  interface AiConversationFieldRefs {
    readonly id: FieldRef<"AiConversation", 'String'>
    readonly guildId: FieldRef<"AiConversation", 'String'>
    readonly channelId: FieldRef<"AiConversation", 'String'>
    readonly userId: FieldRef<"AiConversation", 'String'>
    readonly createdAt: FieldRef<"AiConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"AiConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiConversation findUnique
   */
  export type AiConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation findUniqueOrThrow
   */
  export type AiConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation findFirst
   */
  export type AiConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversations.
     */
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation findFirstOrThrow
   */
  export type AiConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversation to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiConversations.
     */
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation findMany
   */
  export type AiConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter, which AiConversations to fetch.
     */
    where?: AiConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiConversations to fetch.
     */
    orderBy?: AiConversationOrderByWithRelationInput | AiConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiConversations.
     */
    cursor?: AiConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiConversations.
     */
    skip?: number
    distinct?: AiConversationScalarFieldEnum | AiConversationScalarFieldEnum[]
  }

  /**
   * AiConversation create
   */
  export type AiConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a AiConversation.
     */
    data: XOR<AiConversationCreateInput, AiConversationUncheckedCreateInput>
  }

  /**
   * AiConversation createMany
   */
  export type AiConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiConversations.
     */
    data: AiConversationCreateManyInput | AiConversationCreateManyInput[]
  }

  /**
   * AiConversation createManyAndReturn
   */
  export type AiConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiConversations.
     */
    data: AiConversationCreateManyInput | AiConversationCreateManyInput[]
  }

  /**
   * AiConversation update
   */
  export type AiConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a AiConversation.
     */
    data: XOR<AiConversationUpdateInput, AiConversationUncheckedUpdateInput>
    /**
     * Choose, which AiConversation to update.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation updateMany
   */
  export type AiConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiConversations.
     */
    data: XOR<AiConversationUpdateManyMutationInput, AiConversationUncheckedUpdateManyInput>
    /**
     * Filter which AiConversations to update
     */
    where?: AiConversationWhereInput
  }

  /**
   * AiConversation upsert
   */
  export type AiConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the AiConversation to update in case it exists.
     */
    where: AiConversationWhereUniqueInput
    /**
     * In case the AiConversation found by the `where` argument doesn't exist, create a new AiConversation with this data.
     */
    create: XOR<AiConversationCreateInput, AiConversationUncheckedCreateInput>
    /**
     * In case the AiConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiConversationUpdateInput, AiConversationUncheckedUpdateInput>
  }

  /**
   * AiConversation delete
   */
  export type AiConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
    /**
     * Filter which AiConversation to delete.
     */
    where: AiConversationWhereUniqueInput
  }

  /**
   * AiConversation deleteMany
   */
  export type AiConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiConversations to delete
     */
    where?: AiConversationWhereInput
  }

  /**
   * AiConversation.messages
   */
  export type AiConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    where?: AiMessageWhereInput
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    cursor?: AiMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiConversation without action
   */
  export type AiConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiConversation
     */
    select?: AiConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiConversationInclude<ExtArgs> | null
  }


  /**
   * Model AiMessage
   */

  export type AggregateAiMessage = {
    _count: AiMessageCountAggregateOutputType | null
    _min: AiMessageMinAggregateOutputType | null
    _max: AiMessageMaxAggregateOutputType | null
  }

  export type AiMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type AiMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type AiMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    createdAt: number
    _all: number
  }


  export type AiMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type AiMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type AiMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type AiMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMessage to aggregate.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiMessages
    **/
    _count?: true | AiMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiMessageMaxAggregateInputType
  }

  export type GetAiMessageAggregateType<T extends AiMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateAiMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiMessage[P]>
      : GetScalarType<T[P], AggregateAiMessage[P]>
  }




  export type AiMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiMessageWhereInput
    orderBy?: AiMessageOrderByWithAggregationInput | AiMessageOrderByWithAggregationInput[]
    by: AiMessageScalarFieldEnum[] | AiMessageScalarFieldEnum
    having?: AiMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiMessageCountAggregateInputType | true
    _min?: AiMessageMinAggregateInputType
    _max?: AiMessageMaxAggregateInputType
  }

  export type AiMessageGroupByOutputType = {
    id: string
    conversationId: string
    role: string
    content: string
    createdAt: Date
    _count: AiMessageCountAggregateOutputType | null
    _min: AiMessageMinAggregateOutputType | null
    _max: AiMessageMaxAggregateOutputType | null
  }

  type GetAiMessageGroupByPayload<T extends AiMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiMessageGroupByOutputType[P]>
            : GetScalarType<T[P], AiMessageGroupByOutputType[P]>
        }
      >
    >


  export type AiMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiMessage"]>

  export type AiMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiMessage"]>

  export type AiMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type AiMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }
  export type AiMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | AiConversationDefaultArgs<ExtArgs>
  }

  export type $AiMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiMessage"
    objects: {
      conversation: Prisma.$AiConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["aiMessage"]>
    composites: {}
  }

  type AiMessageGetPayload<S extends boolean | null | undefined | AiMessageDefaultArgs> = $Result.GetResult<Prisma.$AiMessagePayload, S>

  type AiMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AiMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AiMessageCountAggregateInputType | true
    }

  export interface AiMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiMessage'], meta: { name: 'AiMessage' } }
    /**
     * Find zero or one AiMessage that matches the filter.
     * @param {AiMessageFindUniqueArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiMessageFindUniqueArgs>(args: SelectSubset<T, AiMessageFindUniqueArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AiMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AiMessageFindUniqueOrThrowArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, AiMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AiMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindFirstArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiMessageFindFirstArgs>(args?: SelectSubset<T, AiMessageFindFirstArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AiMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindFirstOrThrowArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, AiMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AiMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiMessages
     * const aiMessages = await prisma.aiMessage.findMany()
     * 
     * // Get first 10 AiMessages
     * const aiMessages = await prisma.aiMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiMessageWithIdOnly = await prisma.aiMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiMessageFindManyArgs>(args?: SelectSubset<T, AiMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AiMessage.
     * @param {AiMessageCreateArgs} args - Arguments to create a AiMessage.
     * @example
     * // Create one AiMessage
     * const AiMessage = await prisma.aiMessage.create({
     *   data: {
     *     // ... data to create a AiMessage
     *   }
     * })
     * 
     */
    create<T extends AiMessageCreateArgs>(args: SelectSubset<T, AiMessageCreateArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AiMessages.
     * @param {AiMessageCreateManyArgs} args - Arguments to create many AiMessages.
     * @example
     * // Create many AiMessages
     * const aiMessage = await prisma.aiMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiMessageCreateManyArgs>(args?: SelectSubset<T, AiMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiMessages and returns the data saved in the database.
     * @param {AiMessageCreateManyAndReturnArgs} args - Arguments to create many AiMessages.
     * @example
     * // Create many AiMessages
     * const aiMessage = await prisma.aiMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiMessages and only return the `id`
     * const aiMessageWithIdOnly = await prisma.aiMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, AiMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AiMessage.
     * @param {AiMessageDeleteArgs} args - Arguments to delete one AiMessage.
     * @example
     * // Delete one AiMessage
     * const AiMessage = await prisma.aiMessage.delete({
     *   where: {
     *     // ... filter to delete one AiMessage
     *   }
     * })
     * 
     */
    delete<T extends AiMessageDeleteArgs>(args: SelectSubset<T, AiMessageDeleteArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AiMessage.
     * @param {AiMessageUpdateArgs} args - Arguments to update one AiMessage.
     * @example
     * // Update one AiMessage
     * const aiMessage = await prisma.aiMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiMessageUpdateArgs>(args: SelectSubset<T, AiMessageUpdateArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AiMessages.
     * @param {AiMessageDeleteManyArgs} args - Arguments to filter AiMessages to delete.
     * @example
     * // Delete a few AiMessages
     * const { count } = await prisma.aiMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiMessageDeleteManyArgs>(args?: SelectSubset<T, AiMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiMessages
     * const aiMessage = await prisma.aiMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiMessageUpdateManyArgs>(args: SelectSubset<T, AiMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AiMessage.
     * @param {AiMessageUpsertArgs} args - Arguments to update or create a AiMessage.
     * @example
     * // Update or create a AiMessage
     * const aiMessage = await prisma.aiMessage.upsert({
     *   create: {
     *     // ... data to create a AiMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiMessage we want to update
     *   }
     * })
     */
    upsert<T extends AiMessageUpsertArgs>(args: SelectSubset<T, AiMessageUpsertArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AiMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageCountArgs} args - Arguments to filter AiMessages to count.
     * @example
     * // Count the number of AiMessages
     * const count = await prisma.aiMessage.count({
     *   where: {
     *     // ... the filter for the AiMessages we want to count
     *   }
     * })
    **/
    count<T extends AiMessageCountArgs>(
      args?: Subset<T, AiMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiMessageAggregateArgs>(args: Subset<T, AiMessageAggregateArgs>): Prisma.PrismaPromise<GetAiMessageAggregateType<T>>

    /**
     * Group by AiMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageGroupByArgs} args - Group by arguments.
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
      T extends AiMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiMessageGroupByArgs['orderBy'] }
        : { orderBy?: AiMessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiMessage model
   */
  readonly fields: AiMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends AiConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AiConversationDefaultArgs<ExtArgs>>): Prisma__AiConversationClient<$Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the AiMessage model
   */ 
  interface AiMessageFieldRefs {
    readonly id: FieldRef<"AiMessage", 'String'>
    readonly conversationId: FieldRef<"AiMessage", 'String'>
    readonly role: FieldRef<"AiMessage", 'String'>
    readonly content: FieldRef<"AiMessage", 'String'>
    readonly createdAt: FieldRef<"AiMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiMessage findUnique
   */
  export type AiMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage findUniqueOrThrow
   */
  export type AiMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage findFirst
   */
  export type AiMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMessages.
     */
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage findFirstOrThrow
   */
  export type AiMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMessages.
     */
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage findMany
   */
  export type AiMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessages to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage create
   */
  export type AiMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a AiMessage.
     */
    data: XOR<AiMessageCreateInput, AiMessageUncheckedCreateInput>
  }

  /**
   * AiMessage createMany
   */
  export type AiMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiMessages.
     */
    data: AiMessageCreateManyInput | AiMessageCreateManyInput[]
  }

  /**
   * AiMessage createManyAndReturn
   */
  export type AiMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AiMessages.
     */
    data: AiMessageCreateManyInput | AiMessageCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiMessage update
   */
  export type AiMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a AiMessage.
     */
    data: XOR<AiMessageUpdateInput, AiMessageUncheckedUpdateInput>
    /**
     * Choose, which AiMessage to update.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage updateMany
   */
  export type AiMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiMessages.
     */
    data: XOR<AiMessageUpdateManyMutationInput, AiMessageUncheckedUpdateManyInput>
    /**
     * Filter which AiMessages to update
     */
    where?: AiMessageWhereInput
  }

  /**
   * AiMessage upsert
   */
  export type AiMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the AiMessage to update in case it exists.
     */
    where: AiMessageWhereUniqueInput
    /**
     * In case the AiMessage found by the `where` argument doesn't exist, create a new AiMessage with this data.
     */
    create: XOR<AiMessageCreateInput, AiMessageUncheckedCreateInput>
    /**
     * In case the AiMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiMessageUpdateInput, AiMessageUncheckedUpdateInput>
  }

  /**
   * AiMessage delete
   */
  export type AiMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter which AiMessage to delete.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage deleteMany
   */
  export type AiMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMessages to delete
     */
    where?: AiMessageWhereInput
  }

  /**
   * AiMessage without action
   */
  export type AiMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
  }


  /**
   * Model UserLevel
   */

  export type AggregateUserLevel = {
    _count: UserLevelCountAggregateOutputType | null
    _avg: UserLevelAvgAggregateOutputType | null
    _sum: UserLevelSumAggregateOutputType | null
    _min: UserLevelMinAggregateOutputType | null
    _max: UserLevelMaxAggregateOutputType | null
  }

  export type UserLevelAvgAggregateOutputType = {
    xp: number | null
    level: number | null
  }

  export type UserLevelSumAggregateOutputType = {
    xp: number | null
    level: number | null
  }

  export type UserLevelMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    xp: number | null
    level: number | null
    lastXpAt: Date | null
  }

  export type UserLevelMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    xp: number | null
    level: number | null
    lastXpAt: Date | null
  }

  export type UserLevelCountAggregateOutputType = {
    id: number
    guildId: number
    userId: number
    xp: number
    level: number
    lastXpAt: number
    _all: number
  }


  export type UserLevelAvgAggregateInputType = {
    xp?: true
    level?: true
  }

  export type UserLevelSumAggregateInputType = {
    xp?: true
    level?: true
  }

  export type UserLevelMinAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    xp?: true
    level?: true
    lastXpAt?: true
  }

  export type UserLevelMaxAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    xp?: true
    level?: true
    lastXpAt?: true
  }

  export type UserLevelCountAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    xp?: true
    level?: true
    lastXpAt?: true
    _all?: true
  }

  export type UserLevelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLevel to aggregate.
     */
    where?: UserLevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLevels to fetch.
     */
    orderBy?: UserLevelOrderByWithRelationInput | UserLevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserLevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLevels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLevels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserLevels
    **/
    _count?: true | UserLevelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserLevelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserLevelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserLevelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserLevelMaxAggregateInputType
  }

  export type GetUserLevelAggregateType<T extends UserLevelAggregateArgs> = {
        [P in keyof T & keyof AggregateUserLevel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLevel[P]>
      : GetScalarType<T[P], AggregateUserLevel[P]>
  }




  export type UserLevelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLevelWhereInput
    orderBy?: UserLevelOrderByWithAggregationInput | UserLevelOrderByWithAggregationInput[]
    by: UserLevelScalarFieldEnum[] | UserLevelScalarFieldEnum
    having?: UserLevelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLevelCountAggregateInputType | true
    _avg?: UserLevelAvgAggregateInputType
    _sum?: UserLevelSumAggregateInputType
    _min?: UserLevelMinAggregateInputType
    _max?: UserLevelMaxAggregateInputType
  }

  export type UserLevelGroupByOutputType = {
    id: string
    guildId: string
    userId: string
    xp: number
    level: number
    lastXpAt: Date
    _count: UserLevelCountAggregateOutputType | null
    _avg: UserLevelAvgAggregateOutputType | null
    _sum: UserLevelSumAggregateOutputType | null
    _min: UserLevelMinAggregateOutputType | null
    _max: UserLevelMaxAggregateOutputType | null
  }

  type GetUserLevelGroupByPayload<T extends UserLevelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserLevelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserLevelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLevelGroupByOutputType[P]>
            : GetScalarType<T[P], UserLevelGroupByOutputType[P]>
        }
      >
    >


  export type UserLevelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    xp?: boolean
    level?: boolean
    lastXpAt?: boolean
  }, ExtArgs["result"]["userLevel"]>

  export type UserLevelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    xp?: boolean
    level?: boolean
    lastXpAt?: boolean
  }, ExtArgs["result"]["userLevel"]>

  export type UserLevelSelectScalar = {
    id?: boolean
    guildId?: boolean
    userId?: boolean
    xp?: boolean
    level?: boolean
    lastXpAt?: boolean
  }


  export type $UserLevelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserLevel"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      userId: string
      xp: number
      level: number
      lastXpAt: Date
    }, ExtArgs["result"]["userLevel"]>
    composites: {}
  }

  type UserLevelGetPayload<S extends boolean | null | undefined | UserLevelDefaultArgs> = $Result.GetResult<Prisma.$UserLevelPayload, S>

  type UserLevelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserLevelFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserLevelCountAggregateInputType | true
    }

  export interface UserLevelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserLevel'], meta: { name: 'UserLevel' } }
    /**
     * Find zero or one UserLevel that matches the filter.
     * @param {UserLevelFindUniqueArgs} args - Arguments to find a UserLevel
     * @example
     * // Get one UserLevel
     * const userLevel = await prisma.userLevel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLevelFindUniqueArgs>(args: SelectSubset<T, UserLevelFindUniqueArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserLevel that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserLevelFindUniqueOrThrowArgs} args - Arguments to find a UserLevel
     * @example
     * // Get one UserLevel
     * const userLevel = await prisma.userLevel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLevelFindUniqueOrThrowArgs>(args: SelectSubset<T, UserLevelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserLevel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelFindFirstArgs} args - Arguments to find a UserLevel
     * @example
     * // Get one UserLevel
     * const userLevel = await prisma.userLevel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLevelFindFirstArgs>(args?: SelectSubset<T, UserLevelFindFirstArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserLevel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelFindFirstOrThrowArgs} args - Arguments to find a UserLevel
     * @example
     * // Get one UserLevel
     * const userLevel = await prisma.userLevel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLevelFindFirstOrThrowArgs>(args?: SelectSubset<T, UserLevelFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserLevels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLevels
     * const userLevels = await prisma.userLevel.findMany()
     * 
     * // Get first 10 UserLevels
     * const userLevels = await prisma.userLevel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userLevelWithIdOnly = await prisma.userLevel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserLevelFindManyArgs>(args?: SelectSubset<T, UserLevelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserLevel.
     * @param {UserLevelCreateArgs} args - Arguments to create a UserLevel.
     * @example
     * // Create one UserLevel
     * const UserLevel = await prisma.userLevel.create({
     *   data: {
     *     // ... data to create a UserLevel
     *   }
     * })
     * 
     */
    create<T extends UserLevelCreateArgs>(args: SelectSubset<T, UserLevelCreateArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserLevels.
     * @param {UserLevelCreateManyArgs} args - Arguments to create many UserLevels.
     * @example
     * // Create many UserLevels
     * const userLevel = await prisma.userLevel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserLevelCreateManyArgs>(args?: SelectSubset<T, UserLevelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserLevels and returns the data saved in the database.
     * @param {UserLevelCreateManyAndReturnArgs} args - Arguments to create many UserLevels.
     * @example
     * // Create many UserLevels
     * const userLevel = await prisma.userLevel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserLevels and only return the `id`
     * const userLevelWithIdOnly = await prisma.userLevel.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserLevelCreateManyAndReturnArgs>(args?: SelectSubset<T, UserLevelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserLevel.
     * @param {UserLevelDeleteArgs} args - Arguments to delete one UserLevel.
     * @example
     * // Delete one UserLevel
     * const UserLevel = await prisma.userLevel.delete({
     *   where: {
     *     // ... filter to delete one UserLevel
     *   }
     * })
     * 
     */
    delete<T extends UserLevelDeleteArgs>(args: SelectSubset<T, UserLevelDeleteArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserLevel.
     * @param {UserLevelUpdateArgs} args - Arguments to update one UserLevel.
     * @example
     * // Update one UserLevel
     * const userLevel = await prisma.userLevel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserLevelUpdateArgs>(args: SelectSubset<T, UserLevelUpdateArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserLevels.
     * @param {UserLevelDeleteManyArgs} args - Arguments to filter UserLevels to delete.
     * @example
     * // Delete a few UserLevels
     * const { count } = await prisma.userLevel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserLevelDeleteManyArgs>(args?: SelectSubset<T, UserLevelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLevels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLevels
     * const userLevel = await prisma.userLevel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserLevelUpdateManyArgs>(args: SelectSubset<T, UserLevelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserLevel.
     * @param {UserLevelUpsertArgs} args - Arguments to update or create a UserLevel.
     * @example
     * // Update or create a UserLevel
     * const userLevel = await prisma.userLevel.upsert({
     *   create: {
     *     // ... data to create a UserLevel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLevel we want to update
     *   }
     * })
     */
    upsert<T extends UserLevelUpsertArgs>(args: SelectSubset<T, UserLevelUpsertArgs<ExtArgs>>): Prisma__UserLevelClient<$Result.GetResult<Prisma.$UserLevelPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserLevels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelCountArgs} args - Arguments to filter UserLevels to count.
     * @example
     * // Count the number of UserLevels
     * const count = await prisma.userLevel.count({
     *   where: {
     *     // ... the filter for the UserLevels we want to count
     *   }
     * })
    **/
    count<T extends UserLevelCountArgs>(
      args?: Subset<T, UserLevelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLevelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLevel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserLevelAggregateArgs>(args: Subset<T, UserLevelAggregateArgs>): Prisma.PrismaPromise<GetUserLevelAggregateType<T>>

    /**
     * Group by UserLevel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLevelGroupByArgs} args - Group by arguments.
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
      T extends UserLevelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLevelGroupByArgs['orderBy'] }
        : { orderBy?: UserLevelGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserLevelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserLevelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserLevel model
   */
  readonly fields: UserLevelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLevel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLevelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserLevel model
   */ 
  interface UserLevelFieldRefs {
    readonly id: FieldRef<"UserLevel", 'String'>
    readonly guildId: FieldRef<"UserLevel", 'String'>
    readonly userId: FieldRef<"UserLevel", 'String'>
    readonly xp: FieldRef<"UserLevel", 'Int'>
    readonly level: FieldRef<"UserLevel", 'Int'>
    readonly lastXpAt: FieldRef<"UserLevel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserLevel findUnique
   */
  export type UserLevelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter, which UserLevel to fetch.
     */
    where: UserLevelWhereUniqueInput
  }

  /**
   * UserLevel findUniqueOrThrow
   */
  export type UserLevelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter, which UserLevel to fetch.
     */
    where: UserLevelWhereUniqueInput
  }

  /**
   * UserLevel findFirst
   */
  export type UserLevelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter, which UserLevel to fetch.
     */
    where?: UserLevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLevels to fetch.
     */
    orderBy?: UserLevelOrderByWithRelationInput | UserLevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLevels.
     */
    cursor?: UserLevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLevels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLevels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLevels.
     */
    distinct?: UserLevelScalarFieldEnum | UserLevelScalarFieldEnum[]
  }

  /**
   * UserLevel findFirstOrThrow
   */
  export type UserLevelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter, which UserLevel to fetch.
     */
    where?: UserLevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLevels to fetch.
     */
    orderBy?: UserLevelOrderByWithRelationInput | UserLevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLevels.
     */
    cursor?: UserLevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLevels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLevels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLevels.
     */
    distinct?: UserLevelScalarFieldEnum | UserLevelScalarFieldEnum[]
  }

  /**
   * UserLevel findMany
   */
  export type UserLevelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter, which UserLevels to fetch.
     */
    where?: UserLevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLevels to fetch.
     */
    orderBy?: UserLevelOrderByWithRelationInput | UserLevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserLevels.
     */
    cursor?: UserLevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLevels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLevels.
     */
    skip?: number
    distinct?: UserLevelScalarFieldEnum | UserLevelScalarFieldEnum[]
  }

  /**
   * UserLevel create
   */
  export type UserLevelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * The data needed to create a UserLevel.
     */
    data: XOR<UserLevelCreateInput, UserLevelUncheckedCreateInput>
  }

  /**
   * UserLevel createMany
   */
  export type UserLevelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserLevels.
     */
    data: UserLevelCreateManyInput | UserLevelCreateManyInput[]
  }

  /**
   * UserLevel createManyAndReturn
   */
  export type UserLevelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserLevels.
     */
    data: UserLevelCreateManyInput | UserLevelCreateManyInput[]
  }

  /**
   * UserLevel update
   */
  export type UserLevelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * The data needed to update a UserLevel.
     */
    data: XOR<UserLevelUpdateInput, UserLevelUncheckedUpdateInput>
    /**
     * Choose, which UserLevel to update.
     */
    where: UserLevelWhereUniqueInput
  }

  /**
   * UserLevel updateMany
   */
  export type UserLevelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserLevels.
     */
    data: XOR<UserLevelUpdateManyMutationInput, UserLevelUncheckedUpdateManyInput>
    /**
     * Filter which UserLevels to update
     */
    where?: UserLevelWhereInput
  }

  /**
   * UserLevel upsert
   */
  export type UserLevelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * The filter to search for the UserLevel to update in case it exists.
     */
    where: UserLevelWhereUniqueInput
    /**
     * In case the UserLevel found by the `where` argument doesn't exist, create a new UserLevel with this data.
     */
    create: XOR<UserLevelCreateInput, UserLevelUncheckedCreateInput>
    /**
     * In case the UserLevel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLevelUpdateInput, UserLevelUncheckedUpdateInput>
  }

  /**
   * UserLevel delete
   */
  export type UserLevelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
    /**
     * Filter which UserLevel to delete.
     */
    where: UserLevelWhereUniqueInput
  }

  /**
   * UserLevel deleteMany
   */
  export type UserLevelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLevels to delete
     */
    where?: UserLevelWhereInput
  }

  /**
   * UserLevel without action
   */
  export type UserLevelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLevel
     */
    select?: UserLevelSelect<ExtArgs> | null
  }


  /**
   * Model UserEconomy
   */

  export type AggregateUserEconomy = {
    _count: UserEconomyCountAggregateOutputType | null
    _avg: UserEconomyAvgAggregateOutputType | null
    _sum: UserEconomySumAggregateOutputType | null
    _min: UserEconomyMinAggregateOutputType | null
    _max: UserEconomyMaxAggregateOutputType | null
  }

  export type UserEconomyAvgAggregateOutputType = {
    balance: number | null
  }

  export type UserEconomySumAggregateOutputType = {
    balance: number | null
  }

  export type UserEconomyMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    balance: number | null
    lastDailyAt: Date | null
  }

  export type UserEconomyMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    balance: number | null
    lastDailyAt: Date | null
  }

  export type UserEconomyCountAggregateOutputType = {
    id: number
    guildId: number
    userId: number
    balance: number
    lastDailyAt: number
    _all: number
  }


  export type UserEconomyAvgAggregateInputType = {
    balance?: true
  }

  export type UserEconomySumAggregateInputType = {
    balance?: true
  }

  export type UserEconomyMinAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    balance?: true
    lastDailyAt?: true
  }

  export type UserEconomyMaxAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    balance?: true
    lastDailyAt?: true
  }

  export type UserEconomyCountAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    balance?: true
    lastDailyAt?: true
    _all?: true
  }

  export type UserEconomyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserEconomy to aggregate.
     */
    where?: UserEconomyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserEconomies to fetch.
     */
    orderBy?: UserEconomyOrderByWithRelationInput | UserEconomyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserEconomyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserEconomies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserEconomies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserEconomies
    **/
    _count?: true | UserEconomyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserEconomyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserEconomySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserEconomyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserEconomyMaxAggregateInputType
  }

  export type GetUserEconomyAggregateType<T extends UserEconomyAggregateArgs> = {
        [P in keyof T & keyof AggregateUserEconomy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserEconomy[P]>
      : GetScalarType<T[P], AggregateUserEconomy[P]>
  }




  export type UserEconomyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserEconomyWhereInput
    orderBy?: UserEconomyOrderByWithAggregationInput | UserEconomyOrderByWithAggregationInput[]
    by: UserEconomyScalarFieldEnum[] | UserEconomyScalarFieldEnum
    having?: UserEconomyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserEconomyCountAggregateInputType | true
    _avg?: UserEconomyAvgAggregateInputType
    _sum?: UserEconomySumAggregateInputType
    _min?: UserEconomyMinAggregateInputType
    _max?: UserEconomyMaxAggregateInputType
  }

  export type UserEconomyGroupByOutputType = {
    id: string
    guildId: string
    userId: string
    balance: number
    lastDailyAt: Date | null
    _count: UserEconomyCountAggregateOutputType | null
    _avg: UserEconomyAvgAggregateOutputType | null
    _sum: UserEconomySumAggregateOutputType | null
    _min: UserEconomyMinAggregateOutputType | null
    _max: UserEconomyMaxAggregateOutputType | null
  }

  type GetUserEconomyGroupByPayload<T extends UserEconomyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserEconomyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserEconomyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserEconomyGroupByOutputType[P]>
            : GetScalarType<T[P], UserEconomyGroupByOutputType[P]>
        }
      >
    >


  export type UserEconomySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    balance?: boolean
    lastDailyAt?: boolean
  }, ExtArgs["result"]["userEconomy"]>

  export type UserEconomySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    balance?: boolean
    lastDailyAt?: boolean
  }, ExtArgs["result"]["userEconomy"]>

  export type UserEconomySelectScalar = {
    id?: boolean
    guildId?: boolean
    userId?: boolean
    balance?: boolean
    lastDailyAt?: boolean
  }


  export type $UserEconomyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserEconomy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      userId: string
      balance: number
      lastDailyAt: Date | null
    }, ExtArgs["result"]["userEconomy"]>
    composites: {}
  }

  type UserEconomyGetPayload<S extends boolean | null | undefined | UserEconomyDefaultArgs> = $Result.GetResult<Prisma.$UserEconomyPayload, S>

  type UserEconomyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserEconomyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserEconomyCountAggregateInputType | true
    }

  export interface UserEconomyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserEconomy'], meta: { name: 'UserEconomy' } }
    /**
     * Find zero or one UserEconomy that matches the filter.
     * @param {UserEconomyFindUniqueArgs} args - Arguments to find a UserEconomy
     * @example
     * // Get one UserEconomy
     * const userEconomy = await prisma.userEconomy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserEconomyFindUniqueArgs>(args: SelectSubset<T, UserEconomyFindUniqueArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserEconomy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserEconomyFindUniqueOrThrowArgs} args - Arguments to find a UserEconomy
     * @example
     * // Get one UserEconomy
     * const userEconomy = await prisma.userEconomy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserEconomyFindUniqueOrThrowArgs>(args: SelectSubset<T, UserEconomyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserEconomy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyFindFirstArgs} args - Arguments to find a UserEconomy
     * @example
     * // Get one UserEconomy
     * const userEconomy = await prisma.userEconomy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserEconomyFindFirstArgs>(args?: SelectSubset<T, UserEconomyFindFirstArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserEconomy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyFindFirstOrThrowArgs} args - Arguments to find a UserEconomy
     * @example
     * // Get one UserEconomy
     * const userEconomy = await prisma.userEconomy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserEconomyFindFirstOrThrowArgs>(args?: SelectSubset<T, UserEconomyFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserEconomies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserEconomies
     * const userEconomies = await prisma.userEconomy.findMany()
     * 
     * // Get first 10 UserEconomies
     * const userEconomies = await prisma.userEconomy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userEconomyWithIdOnly = await prisma.userEconomy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserEconomyFindManyArgs>(args?: SelectSubset<T, UserEconomyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserEconomy.
     * @param {UserEconomyCreateArgs} args - Arguments to create a UserEconomy.
     * @example
     * // Create one UserEconomy
     * const UserEconomy = await prisma.userEconomy.create({
     *   data: {
     *     // ... data to create a UserEconomy
     *   }
     * })
     * 
     */
    create<T extends UserEconomyCreateArgs>(args: SelectSubset<T, UserEconomyCreateArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserEconomies.
     * @param {UserEconomyCreateManyArgs} args - Arguments to create many UserEconomies.
     * @example
     * // Create many UserEconomies
     * const userEconomy = await prisma.userEconomy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserEconomyCreateManyArgs>(args?: SelectSubset<T, UserEconomyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserEconomies and returns the data saved in the database.
     * @param {UserEconomyCreateManyAndReturnArgs} args - Arguments to create many UserEconomies.
     * @example
     * // Create many UserEconomies
     * const userEconomy = await prisma.userEconomy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserEconomies and only return the `id`
     * const userEconomyWithIdOnly = await prisma.userEconomy.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserEconomyCreateManyAndReturnArgs>(args?: SelectSubset<T, UserEconomyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserEconomy.
     * @param {UserEconomyDeleteArgs} args - Arguments to delete one UserEconomy.
     * @example
     * // Delete one UserEconomy
     * const UserEconomy = await prisma.userEconomy.delete({
     *   where: {
     *     // ... filter to delete one UserEconomy
     *   }
     * })
     * 
     */
    delete<T extends UserEconomyDeleteArgs>(args: SelectSubset<T, UserEconomyDeleteArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserEconomy.
     * @param {UserEconomyUpdateArgs} args - Arguments to update one UserEconomy.
     * @example
     * // Update one UserEconomy
     * const userEconomy = await prisma.userEconomy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserEconomyUpdateArgs>(args: SelectSubset<T, UserEconomyUpdateArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserEconomies.
     * @param {UserEconomyDeleteManyArgs} args - Arguments to filter UserEconomies to delete.
     * @example
     * // Delete a few UserEconomies
     * const { count } = await prisma.userEconomy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserEconomyDeleteManyArgs>(args?: SelectSubset<T, UserEconomyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserEconomies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserEconomies
     * const userEconomy = await prisma.userEconomy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserEconomyUpdateManyArgs>(args: SelectSubset<T, UserEconomyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserEconomy.
     * @param {UserEconomyUpsertArgs} args - Arguments to update or create a UserEconomy.
     * @example
     * // Update or create a UserEconomy
     * const userEconomy = await prisma.userEconomy.upsert({
     *   create: {
     *     // ... data to create a UserEconomy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserEconomy we want to update
     *   }
     * })
     */
    upsert<T extends UserEconomyUpsertArgs>(args: SelectSubset<T, UserEconomyUpsertArgs<ExtArgs>>): Prisma__UserEconomyClient<$Result.GetResult<Prisma.$UserEconomyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserEconomies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyCountArgs} args - Arguments to filter UserEconomies to count.
     * @example
     * // Count the number of UserEconomies
     * const count = await prisma.userEconomy.count({
     *   where: {
     *     // ... the filter for the UserEconomies we want to count
     *   }
     * })
    **/
    count<T extends UserEconomyCountArgs>(
      args?: Subset<T, UserEconomyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserEconomyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserEconomy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserEconomyAggregateArgs>(args: Subset<T, UserEconomyAggregateArgs>): Prisma.PrismaPromise<GetUserEconomyAggregateType<T>>

    /**
     * Group by UserEconomy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserEconomyGroupByArgs} args - Group by arguments.
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
      T extends UserEconomyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserEconomyGroupByArgs['orderBy'] }
        : { orderBy?: UserEconomyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserEconomyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserEconomyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserEconomy model
   */
  readonly fields: UserEconomyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserEconomy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserEconomyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserEconomy model
   */ 
  interface UserEconomyFieldRefs {
    readonly id: FieldRef<"UserEconomy", 'String'>
    readonly guildId: FieldRef<"UserEconomy", 'String'>
    readonly userId: FieldRef<"UserEconomy", 'String'>
    readonly balance: FieldRef<"UserEconomy", 'Int'>
    readonly lastDailyAt: FieldRef<"UserEconomy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserEconomy findUnique
   */
  export type UserEconomyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter, which UserEconomy to fetch.
     */
    where: UserEconomyWhereUniqueInput
  }

  /**
   * UserEconomy findUniqueOrThrow
   */
  export type UserEconomyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter, which UserEconomy to fetch.
     */
    where: UserEconomyWhereUniqueInput
  }

  /**
   * UserEconomy findFirst
   */
  export type UserEconomyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter, which UserEconomy to fetch.
     */
    where?: UserEconomyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserEconomies to fetch.
     */
    orderBy?: UserEconomyOrderByWithRelationInput | UserEconomyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserEconomies.
     */
    cursor?: UserEconomyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserEconomies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserEconomies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserEconomies.
     */
    distinct?: UserEconomyScalarFieldEnum | UserEconomyScalarFieldEnum[]
  }

  /**
   * UserEconomy findFirstOrThrow
   */
  export type UserEconomyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter, which UserEconomy to fetch.
     */
    where?: UserEconomyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserEconomies to fetch.
     */
    orderBy?: UserEconomyOrderByWithRelationInput | UserEconomyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserEconomies.
     */
    cursor?: UserEconomyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserEconomies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserEconomies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserEconomies.
     */
    distinct?: UserEconomyScalarFieldEnum | UserEconomyScalarFieldEnum[]
  }

  /**
   * UserEconomy findMany
   */
  export type UserEconomyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter, which UserEconomies to fetch.
     */
    where?: UserEconomyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserEconomies to fetch.
     */
    orderBy?: UserEconomyOrderByWithRelationInput | UserEconomyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserEconomies.
     */
    cursor?: UserEconomyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserEconomies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserEconomies.
     */
    skip?: number
    distinct?: UserEconomyScalarFieldEnum | UserEconomyScalarFieldEnum[]
  }

  /**
   * UserEconomy create
   */
  export type UserEconomyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * The data needed to create a UserEconomy.
     */
    data: XOR<UserEconomyCreateInput, UserEconomyUncheckedCreateInput>
  }

  /**
   * UserEconomy createMany
   */
  export type UserEconomyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserEconomies.
     */
    data: UserEconomyCreateManyInput | UserEconomyCreateManyInput[]
  }

  /**
   * UserEconomy createManyAndReturn
   */
  export type UserEconomyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserEconomies.
     */
    data: UserEconomyCreateManyInput | UserEconomyCreateManyInput[]
  }

  /**
   * UserEconomy update
   */
  export type UserEconomyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * The data needed to update a UserEconomy.
     */
    data: XOR<UserEconomyUpdateInput, UserEconomyUncheckedUpdateInput>
    /**
     * Choose, which UserEconomy to update.
     */
    where: UserEconomyWhereUniqueInput
  }

  /**
   * UserEconomy updateMany
   */
  export type UserEconomyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserEconomies.
     */
    data: XOR<UserEconomyUpdateManyMutationInput, UserEconomyUncheckedUpdateManyInput>
    /**
     * Filter which UserEconomies to update
     */
    where?: UserEconomyWhereInput
  }

  /**
   * UserEconomy upsert
   */
  export type UserEconomyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * The filter to search for the UserEconomy to update in case it exists.
     */
    where: UserEconomyWhereUniqueInput
    /**
     * In case the UserEconomy found by the `where` argument doesn't exist, create a new UserEconomy with this data.
     */
    create: XOR<UserEconomyCreateInput, UserEconomyUncheckedCreateInput>
    /**
     * In case the UserEconomy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserEconomyUpdateInput, UserEconomyUncheckedUpdateInput>
  }

  /**
   * UserEconomy delete
   */
  export type UserEconomyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
    /**
     * Filter which UserEconomy to delete.
     */
    where: UserEconomyWhereUniqueInput
  }

  /**
   * UserEconomy deleteMany
   */
  export type UserEconomyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserEconomies to delete
     */
    where?: UserEconomyWhereInput
  }

  /**
   * UserEconomy without action
   */
  export type UserEconomyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserEconomy
     */
    select?: UserEconomySelect<ExtArgs> | null
  }


  /**
   * Model Warning
   */

  export type AggregateWarning = {
    _count: WarningCountAggregateOutputType | null
    _min: WarningMinAggregateOutputType | null
    _max: WarningMaxAggregateOutputType | null
  }

  export type WarningMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    moderatorId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type WarningMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    moderatorId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type WarningCountAggregateOutputType = {
    id: number
    guildId: number
    userId: number
    moderatorId: number
    reason: number
    createdAt: number
    _all: number
  }


  export type WarningMinAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
  }

  export type WarningMaxAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
  }

  export type WarningCountAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type WarningAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warning to aggregate.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Warnings
    **/
    _count?: true | WarningCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WarningMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WarningMaxAggregateInputType
  }

  export type GetWarningAggregateType<T extends WarningAggregateArgs> = {
        [P in keyof T & keyof AggregateWarning]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWarning[P]>
      : GetScalarType<T[P], AggregateWarning[P]>
  }




  export type WarningGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WarningWhereInput
    orderBy?: WarningOrderByWithAggregationInput | WarningOrderByWithAggregationInput[]
    by: WarningScalarFieldEnum[] | WarningScalarFieldEnum
    having?: WarningScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WarningCountAggregateInputType | true
    _min?: WarningMinAggregateInputType
    _max?: WarningMaxAggregateInputType
  }

  export type WarningGroupByOutputType = {
    id: string
    guildId: string
    userId: string
    moderatorId: string
    reason: string
    createdAt: Date
    _count: WarningCountAggregateOutputType | null
    _min: WarningMinAggregateOutputType | null
    _max: WarningMaxAggregateOutputType | null
  }

  type GetWarningGroupByPayload<T extends WarningGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WarningGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WarningGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WarningGroupByOutputType[P]>
            : GetScalarType<T[P], WarningGroupByOutputType[P]>
        }
      >
    >


  export type WarningSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    moderatorId?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["warning"]>

  export type WarningSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    moderatorId?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["warning"]>

  export type WarningSelectScalar = {
    id?: boolean
    guildId?: boolean
    userId?: boolean
    moderatorId?: boolean
    reason?: boolean
    createdAt?: boolean
  }


  export type $WarningPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Warning"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      userId: string
      moderatorId: string
      reason: string
      createdAt: Date
    }, ExtArgs["result"]["warning"]>
    composites: {}
  }

  type WarningGetPayload<S extends boolean | null | undefined | WarningDefaultArgs> = $Result.GetResult<Prisma.$WarningPayload, S>

  type WarningCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WarningFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WarningCountAggregateInputType | true
    }

  export interface WarningDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Warning'], meta: { name: 'Warning' } }
    /**
     * Find zero or one Warning that matches the filter.
     * @param {WarningFindUniqueArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WarningFindUniqueArgs>(args: SelectSubset<T, WarningFindUniqueArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Warning that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WarningFindUniqueOrThrowArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WarningFindUniqueOrThrowArgs>(args: SelectSubset<T, WarningFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Warning that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindFirstArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WarningFindFirstArgs>(args?: SelectSubset<T, WarningFindFirstArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Warning that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindFirstOrThrowArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WarningFindFirstOrThrowArgs>(args?: SelectSubset<T, WarningFindFirstOrThrowArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Warnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Warnings
     * const warnings = await prisma.warning.findMany()
     * 
     * // Get first 10 Warnings
     * const warnings = await prisma.warning.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const warningWithIdOnly = await prisma.warning.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WarningFindManyArgs>(args?: SelectSubset<T, WarningFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Warning.
     * @param {WarningCreateArgs} args - Arguments to create a Warning.
     * @example
     * // Create one Warning
     * const Warning = await prisma.warning.create({
     *   data: {
     *     // ... data to create a Warning
     *   }
     * })
     * 
     */
    create<T extends WarningCreateArgs>(args: SelectSubset<T, WarningCreateArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Warnings.
     * @param {WarningCreateManyArgs} args - Arguments to create many Warnings.
     * @example
     * // Create many Warnings
     * const warning = await prisma.warning.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WarningCreateManyArgs>(args?: SelectSubset<T, WarningCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Warnings and returns the data saved in the database.
     * @param {WarningCreateManyAndReturnArgs} args - Arguments to create many Warnings.
     * @example
     * // Create many Warnings
     * const warning = await prisma.warning.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Warnings and only return the `id`
     * const warningWithIdOnly = await prisma.warning.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WarningCreateManyAndReturnArgs>(args?: SelectSubset<T, WarningCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Warning.
     * @param {WarningDeleteArgs} args - Arguments to delete one Warning.
     * @example
     * // Delete one Warning
     * const Warning = await prisma.warning.delete({
     *   where: {
     *     // ... filter to delete one Warning
     *   }
     * })
     * 
     */
    delete<T extends WarningDeleteArgs>(args: SelectSubset<T, WarningDeleteArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Warning.
     * @param {WarningUpdateArgs} args - Arguments to update one Warning.
     * @example
     * // Update one Warning
     * const warning = await prisma.warning.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WarningUpdateArgs>(args: SelectSubset<T, WarningUpdateArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Warnings.
     * @param {WarningDeleteManyArgs} args - Arguments to filter Warnings to delete.
     * @example
     * // Delete a few Warnings
     * const { count } = await prisma.warning.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WarningDeleteManyArgs>(args?: SelectSubset<T, WarningDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Warnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Warnings
     * const warning = await prisma.warning.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WarningUpdateManyArgs>(args: SelectSubset<T, WarningUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Warning.
     * @param {WarningUpsertArgs} args - Arguments to update or create a Warning.
     * @example
     * // Update or create a Warning
     * const warning = await prisma.warning.upsert({
     *   create: {
     *     // ... data to create a Warning
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Warning we want to update
     *   }
     * })
     */
    upsert<T extends WarningUpsertArgs>(args: SelectSubset<T, WarningUpsertArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Warnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningCountArgs} args - Arguments to filter Warnings to count.
     * @example
     * // Count the number of Warnings
     * const count = await prisma.warning.count({
     *   where: {
     *     // ... the filter for the Warnings we want to count
     *   }
     * })
    **/
    count<T extends WarningCountArgs>(
      args?: Subset<T, WarningCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WarningCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Warning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WarningAggregateArgs>(args: Subset<T, WarningAggregateArgs>): Prisma.PrismaPromise<GetWarningAggregateType<T>>

    /**
     * Group by Warning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningGroupByArgs} args - Group by arguments.
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
      T extends WarningGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WarningGroupByArgs['orderBy'] }
        : { orderBy?: WarningGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WarningGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarningGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Warning model
   */
  readonly fields: WarningFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Warning.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WarningClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Warning model
   */ 
  interface WarningFieldRefs {
    readonly id: FieldRef<"Warning", 'String'>
    readonly guildId: FieldRef<"Warning", 'String'>
    readonly userId: FieldRef<"Warning", 'String'>
    readonly moderatorId: FieldRef<"Warning", 'String'>
    readonly reason: FieldRef<"Warning", 'String'>
    readonly createdAt: FieldRef<"Warning", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Warning findUnique
   */
  export type WarningFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning findUniqueOrThrow
   */
  export type WarningFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning findFirst
   */
  export type WarningFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warnings.
     */
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning findFirstOrThrow
   */
  export type WarningFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warnings.
     */
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning findMany
   */
  export type WarningFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter, which Warnings to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning create
   */
  export type WarningCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * The data needed to create a Warning.
     */
    data: XOR<WarningCreateInput, WarningUncheckedCreateInput>
  }

  /**
   * Warning createMany
   */
  export type WarningCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Warnings.
     */
    data: WarningCreateManyInput | WarningCreateManyInput[]
  }

  /**
   * Warning createManyAndReturn
   */
  export type WarningCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Warnings.
     */
    data: WarningCreateManyInput | WarningCreateManyInput[]
  }

  /**
   * Warning update
   */
  export type WarningUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * The data needed to update a Warning.
     */
    data: XOR<WarningUpdateInput, WarningUncheckedUpdateInput>
    /**
     * Choose, which Warning to update.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning updateMany
   */
  export type WarningUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Warnings.
     */
    data: XOR<WarningUpdateManyMutationInput, WarningUncheckedUpdateManyInput>
    /**
     * Filter which Warnings to update
     */
    where?: WarningWhereInput
  }

  /**
   * Warning upsert
   */
  export type WarningUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * The filter to search for the Warning to update in case it exists.
     */
    where: WarningWhereUniqueInput
    /**
     * In case the Warning found by the `where` argument doesn't exist, create a new Warning with this data.
     */
    create: XOR<WarningCreateInput, WarningUncheckedCreateInput>
    /**
     * In case the Warning was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WarningUpdateInput, WarningUncheckedUpdateInput>
  }

  /**
   * Warning delete
   */
  export type WarningDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Filter which Warning to delete.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning deleteMany
   */
  export type WarningDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warnings to delete
     */
    where?: WarningWhereInput
  }

  /**
   * Warning without action
   */
  export type WarningDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    status: string | null
    createdAt: Date | null
    closedAt: Date | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    status: string | null
    createdAt: Date | null
    closedAt: Date | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    guildId: number
    channelId: number
    userId: number
    status: number
    createdAt: number
    closedAt: number
    _all: number
  }


  export type TicketMinAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    status?: true
    createdAt?: true
    closedAt?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    status?: true
    createdAt?: true
    closedAt?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    status?: true
    createdAt?: true
    closedAt?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    guildId: string
    channelId: string
    userId: string
    status: string
    createdAt: Date
    closedAt: Date | null
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    closedAt?: boolean
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    closedAt?: boolean
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectScalar = {
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    status?: boolean
    createdAt?: boolean
    closedAt?: boolean
  }


  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      channelId: string
      userId: string
      status: string
      createdAt: Date
      closedAt: Date | null
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
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
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Ticket model
   */ 
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly guildId: FieldRef<"Ticket", 'String'>
    readonly channelId: FieldRef<"Ticket", 'String'>
    readonly userId: FieldRef<"Ticket", 'String'>
    readonly status: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly closedAt: FieldRef<"Ticket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
  }

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
  }


  /**
   * Model AfkStatus
   */

  export type AggregateAfkStatus = {
    _count: AfkStatusCountAggregateOutputType | null
    _min: AfkStatusMinAggregateOutputType | null
    _max: AfkStatusMaxAggregateOutputType | null
  }

  export type AfkStatusMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type AfkStatusMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    userId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type AfkStatusCountAggregateOutputType = {
    id: number
    guildId: number
    userId: number
    reason: number
    createdAt: number
    _all: number
  }


  export type AfkStatusMinAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    reason?: true
    createdAt?: true
  }

  export type AfkStatusMaxAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    reason?: true
    createdAt?: true
  }

  export type AfkStatusCountAggregateInputType = {
    id?: true
    guildId?: true
    userId?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type AfkStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AfkStatus to aggregate.
     */
    where?: AfkStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AfkStatuses to fetch.
     */
    orderBy?: AfkStatusOrderByWithRelationInput | AfkStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AfkStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AfkStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AfkStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AfkStatuses
    **/
    _count?: true | AfkStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AfkStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AfkStatusMaxAggregateInputType
  }

  export type GetAfkStatusAggregateType<T extends AfkStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateAfkStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAfkStatus[P]>
      : GetScalarType<T[P], AggregateAfkStatus[P]>
  }




  export type AfkStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AfkStatusWhereInput
    orderBy?: AfkStatusOrderByWithAggregationInput | AfkStatusOrderByWithAggregationInput[]
    by: AfkStatusScalarFieldEnum[] | AfkStatusScalarFieldEnum
    having?: AfkStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AfkStatusCountAggregateInputType | true
    _min?: AfkStatusMinAggregateInputType
    _max?: AfkStatusMaxAggregateInputType
  }

  export type AfkStatusGroupByOutputType = {
    id: string
    guildId: string
    userId: string
    reason: string
    createdAt: Date
    _count: AfkStatusCountAggregateOutputType | null
    _min: AfkStatusMinAggregateOutputType | null
    _max: AfkStatusMaxAggregateOutputType | null
  }

  type GetAfkStatusGroupByPayload<T extends AfkStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AfkStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AfkStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AfkStatusGroupByOutputType[P]>
            : GetScalarType<T[P], AfkStatusGroupByOutputType[P]>
        }
      >
    >


  export type AfkStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["afkStatus"]>

  export type AfkStatusSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    userId?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["afkStatus"]>

  export type AfkStatusSelectScalar = {
    id?: boolean
    guildId?: boolean
    userId?: boolean
    reason?: boolean
    createdAt?: boolean
  }


  export type $AfkStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AfkStatus"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      userId: string
      reason: string
      createdAt: Date
    }, ExtArgs["result"]["afkStatus"]>
    composites: {}
  }

  type AfkStatusGetPayload<S extends boolean | null | undefined | AfkStatusDefaultArgs> = $Result.GetResult<Prisma.$AfkStatusPayload, S>

  type AfkStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AfkStatusFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AfkStatusCountAggregateInputType | true
    }

  export interface AfkStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AfkStatus'], meta: { name: 'AfkStatus' } }
    /**
     * Find zero or one AfkStatus that matches the filter.
     * @param {AfkStatusFindUniqueArgs} args - Arguments to find a AfkStatus
     * @example
     * // Get one AfkStatus
     * const afkStatus = await prisma.afkStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AfkStatusFindUniqueArgs>(args: SelectSubset<T, AfkStatusFindUniqueArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AfkStatus that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AfkStatusFindUniqueOrThrowArgs} args - Arguments to find a AfkStatus
     * @example
     * // Get one AfkStatus
     * const afkStatus = await prisma.afkStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AfkStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, AfkStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AfkStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusFindFirstArgs} args - Arguments to find a AfkStatus
     * @example
     * // Get one AfkStatus
     * const afkStatus = await prisma.afkStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AfkStatusFindFirstArgs>(args?: SelectSubset<T, AfkStatusFindFirstArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AfkStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusFindFirstOrThrowArgs} args - Arguments to find a AfkStatus
     * @example
     * // Get one AfkStatus
     * const afkStatus = await prisma.afkStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AfkStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, AfkStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AfkStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AfkStatuses
     * const afkStatuses = await prisma.afkStatus.findMany()
     * 
     * // Get first 10 AfkStatuses
     * const afkStatuses = await prisma.afkStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const afkStatusWithIdOnly = await prisma.afkStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AfkStatusFindManyArgs>(args?: SelectSubset<T, AfkStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AfkStatus.
     * @param {AfkStatusCreateArgs} args - Arguments to create a AfkStatus.
     * @example
     * // Create one AfkStatus
     * const AfkStatus = await prisma.afkStatus.create({
     *   data: {
     *     // ... data to create a AfkStatus
     *   }
     * })
     * 
     */
    create<T extends AfkStatusCreateArgs>(args: SelectSubset<T, AfkStatusCreateArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AfkStatuses.
     * @param {AfkStatusCreateManyArgs} args - Arguments to create many AfkStatuses.
     * @example
     * // Create many AfkStatuses
     * const afkStatus = await prisma.afkStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AfkStatusCreateManyArgs>(args?: SelectSubset<T, AfkStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AfkStatuses and returns the data saved in the database.
     * @param {AfkStatusCreateManyAndReturnArgs} args - Arguments to create many AfkStatuses.
     * @example
     * // Create many AfkStatuses
     * const afkStatus = await prisma.afkStatus.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AfkStatuses and only return the `id`
     * const afkStatusWithIdOnly = await prisma.afkStatus.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AfkStatusCreateManyAndReturnArgs>(args?: SelectSubset<T, AfkStatusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AfkStatus.
     * @param {AfkStatusDeleteArgs} args - Arguments to delete one AfkStatus.
     * @example
     * // Delete one AfkStatus
     * const AfkStatus = await prisma.afkStatus.delete({
     *   where: {
     *     // ... filter to delete one AfkStatus
     *   }
     * })
     * 
     */
    delete<T extends AfkStatusDeleteArgs>(args: SelectSubset<T, AfkStatusDeleteArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AfkStatus.
     * @param {AfkStatusUpdateArgs} args - Arguments to update one AfkStatus.
     * @example
     * // Update one AfkStatus
     * const afkStatus = await prisma.afkStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AfkStatusUpdateArgs>(args: SelectSubset<T, AfkStatusUpdateArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AfkStatuses.
     * @param {AfkStatusDeleteManyArgs} args - Arguments to filter AfkStatuses to delete.
     * @example
     * // Delete a few AfkStatuses
     * const { count } = await prisma.afkStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AfkStatusDeleteManyArgs>(args?: SelectSubset<T, AfkStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AfkStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AfkStatuses
     * const afkStatus = await prisma.afkStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AfkStatusUpdateManyArgs>(args: SelectSubset<T, AfkStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AfkStatus.
     * @param {AfkStatusUpsertArgs} args - Arguments to update or create a AfkStatus.
     * @example
     * // Update or create a AfkStatus
     * const afkStatus = await prisma.afkStatus.upsert({
     *   create: {
     *     // ... data to create a AfkStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AfkStatus we want to update
     *   }
     * })
     */
    upsert<T extends AfkStatusUpsertArgs>(args: SelectSubset<T, AfkStatusUpsertArgs<ExtArgs>>): Prisma__AfkStatusClient<$Result.GetResult<Prisma.$AfkStatusPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AfkStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusCountArgs} args - Arguments to filter AfkStatuses to count.
     * @example
     * // Count the number of AfkStatuses
     * const count = await prisma.afkStatus.count({
     *   where: {
     *     // ... the filter for the AfkStatuses we want to count
     *   }
     * })
    **/
    count<T extends AfkStatusCountArgs>(
      args?: Subset<T, AfkStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AfkStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AfkStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AfkStatusAggregateArgs>(args: Subset<T, AfkStatusAggregateArgs>): Prisma.PrismaPromise<GetAfkStatusAggregateType<T>>

    /**
     * Group by AfkStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AfkStatusGroupByArgs} args - Group by arguments.
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
      T extends AfkStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AfkStatusGroupByArgs['orderBy'] }
        : { orderBy?: AfkStatusGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AfkStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAfkStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AfkStatus model
   */
  readonly fields: AfkStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AfkStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AfkStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AfkStatus model
   */ 
  interface AfkStatusFieldRefs {
    readonly id: FieldRef<"AfkStatus", 'String'>
    readonly guildId: FieldRef<"AfkStatus", 'String'>
    readonly userId: FieldRef<"AfkStatus", 'String'>
    readonly reason: FieldRef<"AfkStatus", 'String'>
    readonly createdAt: FieldRef<"AfkStatus", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AfkStatus findUnique
   */
  export type AfkStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter, which AfkStatus to fetch.
     */
    where: AfkStatusWhereUniqueInput
  }

  /**
   * AfkStatus findUniqueOrThrow
   */
  export type AfkStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter, which AfkStatus to fetch.
     */
    where: AfkStatusWhereUniqueInput
  }

  /**
   * AfkStatus findFirst
   */
  export type AfkStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter, which AfkStatus to fetch.
     */
    where?: AfkStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AfkStatuses to fetch.
     */
    orderBy?: AfkStatusOrderByWithRelationInput | AfkStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AfkStatuses.
     */
    cursor?: AfkStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AfkStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AfkStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AfkStatuses.
     */
    distinct?: AfkStatusScalarFieldEnum | AfkStatusScalarFieldEnum[]
  }

  /**
   * AfkStatus findFirstOrThrow
   */
  export type AfkStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter, which AfkStatus to fetch.
     */
    where?: AfkStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AfkStatuses to fetch.
     */
    orderBy?: AfkStatusOrderByWithRelationInput | AfkStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AfkStatuses.
     */
    cursor?: AfkStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AfkStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AfkStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AfkStatuses.
     */
    distinct?: AfkStatusScalarFieldEnum | AfkStatusScalarFieldEnum[]
  }

  /**
   * AfkStatus findMany
   */
  export type AfkStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter, which AfkStatuses to fetch.
     */
    where?: AfkStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AfkStatuses to fetch.
     */
    orderBy?: AfkStatusOrderByWithRelationInput | AfkStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AfkStatuses.
     */
    cursor?: AfkStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AfkStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AfkStatuses.
     */
    skip?: number
    distinct?: AfkStatusScalarFieldEnum | AfkStatusScalarFieldEnum[]
  }

  /**
   * AfkStatus create
   */
  export type AfkStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * The data needed to create a AfkStatus.
     */
    data: XOR<AfkStatusCreateInput, AfkStatusUncheckedCreateInput>
  }

  /**
   * AfkStatus createMany
   */
  export type AfkStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AfkStatuses.
     */
    data: AfkStatusCreateManyInput | AfkStatusCreateManyInput[]
  }

  /**
   * AfkStatus createManyAndReturn
   */
  export type AfkStatusCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AfkStatuses.
     */
    data: AfkStatusCreateManyInput | AfkStatusCreateManyInput[]
  }

  /**
   * AfkStatus update
   */
  export type AfkStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * The data needed to update a AfkStatus.
     */
    data: XOR<AfkStatusUpdateInput, AfkStatusUncheckedUpdateInput>
    /**
     * Choose, which AfkStatus to update.
     */
    where: AfkStatusWhereUniqueInput
  }

  /**
   * AfkStatus updateMany
   */
  export type AfkStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AfkStatuses.
     */
    data: XOR<AfkStatusUpdateManyMutationInput, AfkStatusUncheckedUpdateManyInput>
    /**
     * Filter which AfkStatuses to update
     */
    where?: AfkStatusWhereInput
  }

  /**
   * AfkStatus upsert
   */
  export type AfkStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * The filter to search for the AfkStatus to update in case it exists.
     */
    where: AfkStatusWhereUniqueInput
    /**
     * In case the AfkStatus found by the `where` argument doesn't exist, create a new AfkStatus with this data.
     */
    create: XOR<AfkStatusCreateInput, AfkStatusUncheckedCreateInput>
    /**
     * In case the AfkStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AfkStatusUpdateInput, AfkStatusUncheckedUpdateInput>
  }

  /**
   * AfkStatus delete
   */
  export type AfkStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
    /**
     * Filter which AfkStatus to delete.
     */
    where: AfkStatusWhereUniqueInput
  }

  /**
   * AfkStatus deleteMany
   */
  export type AfkStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AfkStatuses to delete
     */
    where?: AfkStatusWhereInput
  }

  /**
   * AfkStatus without action
   */
  export type AfkStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AfkStatus
     */
    select?: AfkStatusSelect<ExtArgs> | null
  }


  /**
   * Model Reminder
   */

  export type AggregateReminder = {
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  export type ReminderMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    message: string | null
    remindAt: Date | null
    isCompleted: boolean | null
    createdAt: Date | null
  }

  export type ReminderMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    userId: string | null
    message: string | null
    remindAt: Date | null
    isCompleted: boolean | null
    createdAt: Date | null
  }

  export type ReminderCountAggregateOutputType = {
    id: number
    guildId: number
    channelId: number
    userId: number
    message: number
    remindAt: number
    isCompleted: number
    createdAt: number
    _all: number
  }


  export type ReminderMinAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    message?: true
    remindAt?: true
    isCompleted?: true
    createdAt?: true
  }

  export type ReminderMaxAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    message?: true
    remindAt?: true
    isCompleted?: true
    createdAt?: true
  }

  export type ReminderCountAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    userId?: true
    message?: true
    remindAt?: true
    isCompleted?: true
    createdAt?: true
    _all?: true
  }

  export type ReminderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reminder to aggregate.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reminders
    **/
    _count?: true | ReminderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReminderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReminderMaxAggregateInputType
  }

  export type GetReminderAggregateType<T extends ReminderAggregateArgs> = {
        [P in keyof T & keyof AggregateReminder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReminder[P]>
      : GetScalarType<T[P], AggregateReminder[P]>
  }




  export type ReminderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReminderWhereInput
    orderBy?: ReminderOrderByWithAggregationInput | ReminderOrderByWithAggregationInput[]
    by: ReminderScalarFieldEnum[] | ReminderScalarFieldEnum
    having?: ReminderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReminderCountAggregateInputType | true
    _min?: ReminderMinAggregateInputType
    _max?: ReminderMaxAggregateInputType
  }

  export type ReminderGroupByOutputType = {
    id: string
    guildId: string | null
    channelId: string
    userId: string
    message: string
    remindAt: Date
    isCompleted: boolean
    createdAt: Date
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  type GetReminderGroupByPayload<T extends ReminderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReminderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReminderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReminderGroupByOutputType[P]>
            : GetScalarType<T[P], ReminderGroupByOutputType[P]>
        }
      >
    >


  export type ReminderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    message?: boolean
    remindAt?: boolean
    isCompleted?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reminder"]>

  export type ReminderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    message?: boolean
    remindAt?: boolean
    isCompleted?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["reminder"]>

  export type ReminderSelectScalar = {
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    userId?: boolean
    message?: boolean
    remindAt?: boolean
    isCompleted?: boolean
    createdAt?: boolean
  }


  export type $ReminderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reminder"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string | null
      channelId: string
      userId: string
      message: string
      remindAt: Date
      isCompleted: boolean
      createdAt: Date
    }, ExtArgs["result"]["reminder"]>
    composites: {}
  }

  type ReminderGetPayload<S extends boolean | null | undefined | ReminderDefaultArgs> = $Result.GetResult<Prisma.$ReminderPayload, S>

  type ReminderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReminderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReminderCountAggregateInputType | true
    }

  export interface ReminderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reminder'], meta: { name: 'Reminder' } }
    /**
     * Find zero or one Reminder that matches the filter.
     * @param {ReminderFindUniqueArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReminderFindUniqueArgs>(args: SelectSubset<T, ReminderFindUniqueArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reminder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReminderFindUniqueOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReminderFindUniqueOrThrowArgs>(args: SelectSubset<T, ReminderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reminder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReminderFindFirstArgs>(args?: SelectSubset<T, ReminderFindFirstArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reminder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReminderFindFirstOrThrowArgs>(args?: SelectSubset<T, ReminderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reminders
     * const reminders = await prisma.reminder.findMany()
     * 
     * // Get first 10 Reminders
     * const reminders = await prisma.reminder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reminderWithIdOnly = await prisma.reminder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReminderFindManyArgs>(args?: SelectSubset<T, ReminderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reminder.
     * @param {ReminderCreateArgs} args - Arguments to create a Reminder.
     * @example
     * // Create one Reminder
     * const Reminder = await prisma.reminder.create({
     *   data: {
     *     // ... data to create a Reminder
     *   }
     * })
     * 
     */
    create<T extends ReminderCreateArgs>(args: SelectSubset<T, ReminderCreateArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reminders.
     * @param {ReminderCreateManyArgs} args - Arguments to create many Reminders.
     * @example
     * // Create many Reminders
     * const reminder = await prisma.reminder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReminderCreateManyArgs>(args?: SelectSubset<T, ReminderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reminders and returns the data saved in the database.
     * @param {ReminderCreateManyAndReturnArgs} args - Arguments to create many Reminders.
     * @example
     * // Create many Reminders
     * const reminder = await prisma.reminder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reminders and only return the `id`
     * const reminderWithIdOnly = await prisma.reminder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReminderCreateManyAndReturnArgs>(args?: SelectSubset<T, ReminderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reminder.
     * @param {ReminderDeleteArgs} args - Arguments to delete one Reminder.
     * @example
     * // Delete one Reminder
     * const Reminder = await prisma.reminder.delete({
     *   where: {
     *     // ... filter to delete one Reminder
     *   }
     * })
     * 
     */
    delete<T extends ReminderDeleteArgs>(args: SelectSubset<T, ReminderDeleteArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reminder.
     * @param {ReminderUpdateArgs} args - Arguments to update one Reminder.
     * @example
     * // Update one Reminder
     * const reminder = await prisma.reminder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReminderUpdateArgs>(args: SelectSubset<T, ReminderUpdateArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reminders.
     * @param {ReminderDeleteManyArgs} args - Arguments to filter Reminders to delete.
     * @example
     * // Delete a few Reminders
     * const { count } = await prisma.reminder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReminderDeleteManyArgs>(args?: SelectSubset<T, ReminderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reminders
     * const reminder = await prisma.reminder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReminderUpdateManyArgs>(args: SelectSubset<T, ReminderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reminder.
     * @param {ReminderUpsertArgs} args - Arguments to update or create a Reminder.
     * @example
     * // Update or create a Reminder
     * const reminder = await prisma.reminder.upsert({
     *   create: {
     *     // ... data to create a Reminder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reminder we want to update
     *   }
     * })
     */
    upsert<T extends ReminderUpsertArgs>(args: SelectSubset<T, ReminderUpsertArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderCountArgs} args - Arguments to filter Reminders to count.
     * @example
     * // Count the number of Reminders
     * const count = await prisma.reminder.count({
     *   where: {
     *     // ... the filter for the Reminders we want to count
     *   }
     * })
    **/
    count<T extends ReminderCountArgs>(
      args?: Subset<T, ReminderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReminderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReminderAggregateArgs>(args: Subset<T, ReminderAggregateArgs>): Prisma.PrismaPromise<GetReminderAggregateType<T>>

    /**
     * Group by Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderGroupByArgs} args - Group by arguments.
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
      T extends ReminderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReminderGroupByArgs['orderBy'] }
        : { orderBy?: ReminderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReminderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReminderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reminder model
   */
  readonly fields: ReminderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reminder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReminderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Reminder model
   */ 
  interface ReminderFieldRefs {
    readonly id: FieldRef<"Reminder", 'String'>
    readonly guildId: FieldRef<"Reminder", 'String'>
    readonly channelId: FieldRef<"Reminder", 'String'>
    readonly userId: FieldRef<"Reminder", 'String'>
    readonly message: FieldRef<"Reminder", 'String'>
    readonly remindAt: FieldRef<"Reminder", 'DateTime'>
    readonly isCompleted: FieldRef<"Reminder", 'Boolean'>
    readonly createdAt: FieldRef<"Reminder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reminder findUnique
   */
  export type ReminderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findUniqueOrThrow
   */
  export type ReminderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findFirst
   */
  export type ReminderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findFirstOrThrow
   */
  export type ReminderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findMany
   */
  export type ReminderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter, which Reminders to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder create
   */
  export type ReminderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * The data needed to create a Reminder.
     */
    data: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
  }

  /**
   * Reminder createMany
   */
  export type ReminderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reminders.
     */
    data: ReminderCreateManyInput | ReminderCreateManyInput[]
  }

  /**
   * Reminder createManyAndReturn
   */
  export type ReminderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reminders.
     */
    data: ReminderCreateManyInput | ReminderCreateManyInput[]
  }

  /**
   * Reminder update
   */
  export type ReminderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * The data needed to update a Reminder.
     */
    data: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
    /**
     * Choose, which Reminder to update.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder updateMany
   */
  export type ReminderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reminders.
     */
    data: XOR<ReminderUpdateManyMutationInput, ReminderUncheckedUpdateManyInput>
    /**
     * Filter which Reminders to update
     */
    where?: ReminderWhereInput
  }

  /**
   * Reminder upsert
   */
  export type ReminderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * The filter to search for the Reminder to update in case it exists.
     */
    where: ReminderWhereUniqueInput
    /**
     * In case the Reminder found by the `where` argument doesn't exist, create a new Reminder with this data.
     */
    create: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
    /**
     * In case the Reminder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
  }

  /**
   * Reminder delete
   */
  export type ReminderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Filter which Reminder to delete.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder deleteMany
   */
  export type ReminderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reminders to delete
     */
    where?: ReminderWhereInput
  }

  /**
   * Reminder without action
   */
  export type ReminderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
  }


  /**
   * Model Poll
   */

  export type AggregatePoll = {
    _count: PollCountAggregateOutputType | null
    _min: PollMinAggregateOutputType | null
    _max: PollMaxAggregateOutputType | null
  }

  export type PollMinAggregateOutputType = {
    id: string | null
    messageId: string | null
    channelId: string | null
    guildId: string | null
    question: string | null
    options: string | null
    votes: string | null
    creatorId: string | null
    createdAt: Date | null
  }

  export type PollMaxAggregateOutputType = {
    id: string | null
    messageId: string | null
    channelId: string | null
    guildId: string | null
    question: string | null
    options: string | null
    votes: string | null
    creatorId: string | null
    createdAt: Date | null
  }

  export type PollCountAggregateOutputType = {
    id: number
    messageId: number
    channelId: number
    guildId: number
    question: number
    options: number
    votes: number
    creatorId: number
    createdAt: number
    _all: number
  }


  export type PollMinAggregateInputType = {
    id?: true
    messageId?: true
    channelId?: true
    guildId?: true
    question?: true
    options?: true
    votes?: true
    creatorId?: true
    createdAt?: true
  }

  export type PollMaxAggregateInputType = {
    id?: true
    messageId?: true
    channelId?: true
    guildId?: true
    question?: true
    options?: true
    votes?: true
    creatorId?: true
    createdAt?: true
  }

  export type PollCountAggregateInputType = {
    id?: true
    messageId?: true
    channelId?: true
    guildId?: true
    question?: true
    options?: true
    votes?: true
    creatorId?: true
    createdAt?: true
    _all?: true
  }

  export type PollAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Poll to aggregate.
     */
    where?: PollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Polls to fetch.
     */
    orderBy?: PollOrderByWithRelationInput | PollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Polls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Polls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Polls
    **/
    _count?: true | PollCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PollMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PollMaxAggregateInputType
  }

  export type GetPollAggregateType<T extends PollAggregateArgs> = {
        [P in keyof T & keyof AggregatePoll]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePoll[P]>
      : GetScalarType<T[P], AggregatePoll[P]>
  }




  export type PollGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PollWhereInput
    orderBy?: PollOrderByWithAggregationInput | PollOrderByWithAggregationInput[]
    by: PollScalarFieldEnum[] | PollScalarFieldEnum
    having?: PollScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PollCountAggregateInputType | true
    _min?: PollMinAggregateInputType
    _max?: PollMaxAggregateInputType
  }

  export type PollGroupByOutputType = {
    id: string
    messageId: string
    channelId: string
    guildId: string
    question: string
    options: string
    votes: string
    creatorId: string
    createdAt: Date
    _count: PollCountAggregateOutputType | null
    _min: PollMinAggregateOutputType | null
    _max: PollMaxAggregateOutputType | null
  }

  type GetPollGroupByPayload<T extends PollGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PollGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PollGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PollGroupByOutputType[P]>
            : GetScalarType<T[P], PollGroupByOutputType[P]>
        }
      >
    >


  export type PollSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    channelId?: boolean
    guildId?: boolean
    question?: boolean
    options?: boolean
    votes?: boolean
    creatorId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["poll"]>

  export type PollSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    channelId?: boolean
    guildId?: boolean
    question?: boolean
    options?: boolean
    votes?: boolean
    creatorId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["poll"]>

  export type PollSelectScalar = {
    id?: boolean
    messageId?: boolean
    channelId?: boolean
    guildId?: boolean
    question?: boolean
    options?: boolean
    votes?: boolean
    creatorId?: boolean
    createdAt?: boolean
  }


  export type $PollPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Poll"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messageId: string
      channelId: string
      guildId: string
      question: string
      options: string
      votes: string
      creatorId: string
      createdAt: Date
    }, ExtArgs["result"]["poll"]>
    composites: {}
  }

  type PollGetPayload<S extends boolean | null | undefined | PollDefaultArgs> = $Result.GetResult<Prisma.$PollPayload, S>

  type PollCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PollFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PollCountAggregateInputType | true
    }

  export interface PollDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Poll'], meta: { name: 'Poll' } }
    /**
     * Find zero or one Poll that matches the filter.
     * @param {PollFindUniqueArgs} args - Arguments to find a Poll
     * @example
     * // Get one Poll
     * const poll = await prisma.poll.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PollFindUniqueArgs>(args: SelectSubset<T, PollFindUniqueArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Poll that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PollFindUniqueOrThrowArgs} args - Arguments to find a Poll
     * @example
     * // Get one Poll
     * const poll = await prisma.poll.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PollFindUniqueOrThrowArgs>(args: SelectSubset<T, PollFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Poll that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollFindFirstArgs} args - Arguments to find a Poll
     * @example
     * // Get one Poll
     * const poll = await prisma.poll.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PollFindFirstArgs>(args?: SelectSubset<T, PollFindFirstArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Poll that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollFindFirstOrThrowArgs} args - Arguments to find a Poll
     * @example
     * // Get one Poll
     * const poll = await prisma.poll.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PollFindFirstOrThrowArgs>(args?: SelectSubset<T, PollFindFirstOrThrowArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Polls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Polls
     * const polls = await prisma.poll.findMany()
     * 
     * // Get first 10 Polls
     * const polls = await prisma.poll.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pollWithIdOnly = await prisma.poll.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PollFindManyArgs>(args?: SelectSubset<T, PollFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Poll.
     * @param {PollCreateArgs} args - Arguments to create a Poll.
     * @example
     * // Create one Poll
     * const Poll = await prisma.poll.create({
     *   data: {
     *     // ... data to create a Poll
     *   }
     * })
     * 
     */
    create<T extends PollCreateArgs>(args: SelectSubset<T, PollCreateArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Polls.
     * @param {PollCreateManyArgs} args - Arguments to create many Polls.
     * @example
     * // Create many Polls
     * const poll = await prisma.poll.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PollCreateManyArgs>(args?: SelectSubset<T, PollCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Polls and returns the data saved in the database.
     * @param {PollCreateManyAndReturnArgs} args - Arguments to create many Polls.
     * @example
     * // Create many Polls
     * const poll = await prisma.poll.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Polls and only return the `id`
     * const pollWithIdOnly = await prisma.poll.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PollCreateManyAndReturnArgs>(args?: SelectSubset<T, PollCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Poll.
     * @param {PollDeleteArgs} args - Arguments to delete one Poll.
     * @example
     * // Delete one Poll
     * const Poll = await prisma.poll.delete({
     *   where: {
     *     // ... filter to delete one Poll
     *   }
     * })
     * 
     */
    delete<T extends PollDeleteArgs>(args: SelectSubset<T, PollDeleteArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Poll.
     * @param {PollUpdateArgs} args - Arguments to update one Poll.
     * @example
     * // Update one Poll
     * const poll = await prisma.poll.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PollUpdateArgs>(args: SelectSubset<T, PollUpdateArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Polls.
     * @param {PollDeleteManyArgs} args - Arguments to filter Polls to delete.
     * @example
     * // Delete a few Polls
     * const { count } = await prisma.poll.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PollDeleteManyArgs>(args?: SelectSubset<T, PollDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Polls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Polls
     * const poll = await prisma.poll.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PollUpdateManyArgs>(args: SelectSubset<T, PollUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Poll.
     * @param {PollUpsertArgs} args - Arguments to update or create a Poll.
     * @example
     * // Update or create a Poll
     * const poll = await prisma.poll.upsert({
     *   create: {
     *     // ... data to create a Poll
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Poll we want to update
     *   }
     * })
     */
    upsert<T extends PollUpsertArgs>(args: SelectSubset<T, PollUpsertArgs<ExtArgs>>): Prisma__PollClient<$Result.GetResult<Prisma.$PollPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Polls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollCountArgs} args - Arguments to filter Polls to count.
     * @example
     * // Count the number of Polls
     * const count = await prisma.poll.count({
     *   where: {
     *     // ... the filter for the Polls we want to count
     *   }
     * })
    **/
    count<T extends PollCountArgs>(
      args?: Subset<T, PollCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PollCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Poll.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PollAggregateArgs>(args: Subset<T, PollAggregateArgs>): Prisma.PrismaPromise<GetPollAggregateType<T>>

    /**
     * Group by Poll.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PollGroupByArgs} args - Group by arguments.
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
      T extends PollGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PollGroupByArgs['orderBy'] }
        : { orderBy?: PollGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PollGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPollGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Poll model
   */
  readonly fields: PollFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Poll.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PollClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Poll model
   */ 
  interface PollFieldRefs {
    readonly id: FieldRef<"Poll", 'String'>
    readonly messageId: FieldRef<"Poll", 'String'>
    readonly channelId: FieldRef<"Poll", 'String'>
    readonly guildId: FieldRef<"Poll", 'String'>
    readonly question: FieldRef<"Poll", 'String'>
    readonly options: FieldRef<"Poll", 'String'>
    readonly votes: FieldRef<"Poll", 'String'>
    readonly creatorId: FieldRef<"Poll", 'String'>
    readonly createdAt: FieldRef<"Poll", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Poll findUnique
   */
  export type PollFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter, which Poll to fetch.
     */
    where: PollWhereUniqueInput
  }

  /**
   * Poll findUniqueOrThrow
   */
  export type PollFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter, which Poll to fetch.
     */
    where: PollWhereUniqueInput
  }

  /**
   * Poll findFirst
   */
  export type PollFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter, which Poll to fetch.
     */
    where?: PollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Polls to fetch.
     */
    orderBy?: PollOrderByWithRelationInput | PollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Polls.
     */
    cursor?: PollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Polls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Polls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Polls.
     */
    distinct?: PollScalarFieldEnum | PollScalarFieldEnum[]
  }

  /**
   * Poll findFirstOrThrow
   */
  export type PollFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter, which Poll to fetch.
     */
    where?: PollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Polls to fetch.
     */
    orderBy?: PollOrderByWithRelationInput | PollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Polls.
     */
    cursor?: PollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Polls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Polls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Polls.
     */
    distinct?: PollScalarFieldEnum | PollScalarFieldEnum[]
  }

  /**
   * Poll findMany
   */
  export type PollFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter, which Polls to fetch.
     */
    where?: PollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Polls to fetch.
     */
    orderBy?: PollOrderByWithRelationInput | PollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Polls.
     */
    cursor?: PollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Polls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Polls.
     */
    skip?: number
    distinct?: PollScalarFieldEnum | PollScalarFieldEnum[]
  }

  /**
   * Poll create
   */
  export type PollCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * The data needed to create a Poll.
     */
    data: XOR<PollCreateInput, PollUncheckedCreateInput>
  }

  /**
   * Poll createMany
   */
  export type PollCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Polls.
     */
    data: PollCreateManyInput | PollCreateManyInput[]
  }

  /**
   * Poll createManyAndReturn
   */
  export type PollCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Polls.
     */
    data: PollCreateManyInput | PollCreateManyInput[]
  }

  /**
   * Poll update
   */
  export type PollUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * The data needed to update a Poll.
     */
    data: XOR<PollUpdateInput, PollUncheckedUpdateInput>
    /**
     * Choose, which Poll to update.
     */
    where: PollWhereUniqueInput
  }

  /**
   * Poll updateMany
   */
  export type PollUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Polls.
     */
    data: XOR<PollUpdateManyMutationInput, PollUncheckedUpdateManyInput>
    /**
     * Filter which Polls to update
     */
    where?: PollWhereInput
  }

  /**
   * Poll upsert
   */
  export type PollUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * The filter to search for the Poll to update in case it exists.
     */
    where: PollWhereUniqueInput
    /**
     * In case the Poll found by the `where` argument doesn't exist, create a new Poll with this data.
     */
    create: XOR<PollCreateInput, PollUncheckedCreateInput>
    /**
     * In case the Poll was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PollUpdateInput, PollUncheckedUpdateInput>
  }

  /**
   * Poll delete
   */
  export type PollDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
    /**
     * Filter which Poll to delete.
     */
    where: PollWhereUniqueInput
  }

  /**
   * Poll deleteMany
   */
  export type PollDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Polls to delete
     */
    where?: PollWhereInput
  }

  /**
   * Poll without action
   */
  export type PollDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Poll
     */
    select?: PollSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GuildConfigScalarFieldEnum: {
    guildId: 'guildId',
    welcomeChannelId: 'welcomeChannelId',
    welcomeMessage: 'welcomeMessage',
    autoRoleId: 'autoRoleId',
    logChannelId: 'logChannelId',
    githubChannelId: 'githubChannelId',
    aiChannelId: 'aiChannelId',
    antiInvite: 'antiInvite',
    antiLinks: 'antiLinks',
    antiSpam: 'antiSpam',
    maxMentions: 'maxMentions',
    blockedWords: 'blockedWords',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GuildConfigScalarFieldEnum = (typeof GuildConfigScalarFieldEnum)[keyof typeof GuildConfigScalarFieldEnum]


  export const AiConversationScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    channelId: 'channelId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiConversationScalarFieldEnum = (typeof AiConversationScalarFieldEnum)[keyof typeof AiConversationScalarFieldEnum]


  export const AiMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type AiMessageScalarFieldEnum = (typeof AiMessageScalarFieldEnum)[keyof typeof AiMessageScalarFieldEnum]


  export const UserLevelScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    userId: 'userId',
    xp: 'xp',
    level: 'level',
    lastXpAt: 'lastXpAt'
  };

  export type UserLevelScalarFieldEnum = (typeof UserLevelScalarFieldEnum)[keyof typeof UserLevelScalarFieldEnum]


  export const UserEconomyScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    userId: 'userId',
    balance: 'balance',
    lastDailyAt: 'lastDailyAt'
  };

  export type UserEconomyScalarFieldEnum = (typeof UserEconomyScalarFieldEnum)[keyof typeof UserEconomyScalarFieldEnum]


  export const WarningScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    userId: 'userId',
    moderatorId: 'moderatorId',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type WarningScalarFieldEnum = (typeof WarningScalarFieldEnum)[keyof typeof WarningScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    channelId: 'channelId',
    userId: 'userId',
    status: 'status',
    createdAt: 'createdAt',
    closedAt: 'closedAt'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const AfkStatusScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    userId: 'userId',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type AfkStatusScalarFieldEnum = (typeof AfkStatusScalarFieldEnum)[keyof typeof AfkStatusScalarFieldEnum]


  export const ReminderScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    channelId: 'channelId',
    userId: 'userId',
    message: 'message',
    remindAt: 'remindAt',
    isCompleted: 'isCompleted',
    createdAt: 'createdAt'
  };

  export type ReminderScalarFieldEnum = (typeof ReminderScalarFieldEnum)[keyof typeof ReminderScalarFieldEnum]


  export const PollScalarFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    channelId: 'channelId',
    guildId: 'guildId',
    question: 'question',
    options: 'options',
    votes: 'votes',
    creatorId: 'creatorId',
    createdAt: 'createdAt'
  };

  export type PollScalarFieldEnum = (typeof PollScalarFieldEnum)[keyof typeof PollScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type GuildConfigWhereInput = {
    AND?: GuildConfigWhereInput | GuildConfigWhereInput[]
    OR?: GuildConfigWhereInput[]
    NOT?: GuildConfigWhereInput | GuildConfigWhereInput[]
    guildId?: StringFilter<"GuildConfig"> | string
    welcomeChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    welcomeMessage?: StringNullableFilter<"GuildConfig"> | string | null
    autoRoleId?: StringNullableFilter<"GuildConfig"> | string | null
    logChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    githubChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    aiChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    antiInvite?: BoolFilter<"GuildConfig"> | boolean
    antiLinks?: BoolFilter<"GuildConfig"> | boolean
    antiSpam?: BoolFilter<"GuildConfig"> | boolean
    maxMentions?: IntFilter<"GuildConfig"> | number
    blockedWords?: StringFilter<"GuildConfig"> | string
    createdAt?: DateTimeFilter<"GuildConfig"> | Date | string
    updatedAt?: DateTimeFilter<"GuildConfig"> | Date | string
  }

  export type GuildConfigOrderByWithRelationInput = {
    guildId?: SortOrder
    welcomeChannelId?: SortOrderInput | SortOrder
    welcomeMessage?: SortOrderInput | SortOrder
    autoRoleId?: SortOrderInput | SortOrder
    logChannelId?: SortOrderInput | SortOrder
    githubChannelId?: SortOrderInput | SortOrder
    aiChannelId?: SortOrderInput | SortOrder
    antiInvite?: SortOrder
    antiLinks?: SortOrder
    antiSpam?: SortOrder
    maxMentions?: SortOrder
    blockedWords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildConfigWhereUniqueInput = Prisma.AtLeast<{
    guildId?: string
    AND?: GuildConfigWhereInput | GuildConfigWhereInput[]
    OR?: GuildConfigWhereInput[]
    NOT?: GuildConfigWhereInput | GuildConfigWhereInput[]
    welcomeChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    welcomeMessage?: StringNullableFilter<"GuildConfig"> | string | null
    autoRoleId?: StringNullableFilter<"GuildConfig"> | string | null
    logChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    githubChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    aiChannelId?: StringNullableFilter<"GuildConfig"> | string | null
    antiInvite?: BoolFilter<"GuildConfig"> | boolean
    antiLinks?: BoolFilter<"GuildConfig"> | boolean
    antiSpam?: BoolFilter<"GuildConfig"> | boolean
    maxMentions?: IntFilter<"GuildConfig"> | number
    blockedWords?: StringFilter<"GuildConfig"> | string
    createdAt?: DateTimeFilter<"GuildConfig"> | Date | string
    updatedAt?: DateTimeFilter<"GuildConfig"> | Date | string
  }, "guildId">

  export type GuildConfigOrderByWithAggregationInput = {
    guildId?: SortOrder
    welcomeChannelId?: SortOrderInput | SortOrder
    welcomeMessage?: SortOrderInput | SortOrder
    autoRoleId?: SortOrderInput | SortOrder
    logChannelId?: SortOrderInput | SortOrder
    githubChannelId?: SortOrderInput | SortOrder
    aiChannelId?: SortOrderInput | SortOrder
    antiInvite?: SortOrder
    antiLinks?: SortOrder
    antiSpam?: SortOrder
    maxMentions?: SortOrder
    blockedWords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GuildConfigCountOrderByAggregateInput
    _avg?: GuildConfigAvgOrderByAggregateInput
    _max?: GuildConfigMaxOrderByAggregateInput
    _min?: GuildConfigMinOrderByAggregateInput
    _sum?: GuildConfigSumOrderByAggregateInput
  }

  export type GuildConfigScalarWhereWithAggregatesInput = {
    AND?: GuildConfigScalarWhereWithAggregatesInput | GuildConfigScalarWhereWithAggregatesInput[]
    OR?: GuildConfigScalarWhereWithAggregatesInput[]
    NOT?: GuildConfigScalarWhereWithAggregatesInput | GuildConfigScalarWhereWithAggregatesInput[]
    guildId?: StringWithAggregatesFilter<"GuildConfig"> | string
    welcomeChannelId?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    welcomeMessage?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    autoRoleId?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    logChannelId?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    githubChannelId?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    aiChannelId?: StringNullableWithAggregatesFilter<"GuildConfig"> | string | null
    antiInvite?: BoolWithAggregatesFilter<"GuildConfig"> | boolean
    antiLinks?: BoolWithAggregatesFilter<"GuildConfig"> | boolean
    antiSpam?: BoolWithAggregatesFilter<"GuildConfig"> | boolean
    maxMentions?: IntWithAggregatesFilter<"GuildConfig"> | number
    blockedWords?: StringWithAggregatesFilter<"GuildConfig"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GuildConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GuildConfig"> | Date | string
  }

  export type AiConversationWhereInput = {
    AND?: AiConversationWhereInput | AiConversationWhereInput[]
    OR?: AiConversationWhereInput[]
    NOT?: AiConversationWhereInput | AiConversationWhereInput[]
    id?: StringFilter<"AiConversation"> | string
    guildId?: StringFilter<"AiConversation"> | string
    channelId?: StringFilter<"AiConversation"> | string
    userId?: StringFilter<"AiConversation"> | string
    createdAt?: DateTimeFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AiConversation"> | Date | string
    messages?: AiMessageListRelationFilter
  }

  export type AiConversationOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: AiMessageOrderByRelationAggregateInput
  }

  export type AiConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiConversationWhereInput | AiConversationWhereInput[]
    OR?: AiConversationWhereInput[]
    NOT?: AiConversationWhereInput | AiConversationWhereInput[]
    guildId?: StringFilter<"AiConversation"> | string
    channelId?: StringFilter<"AiConversation"> | string
    userId?: StringFilter<"AiConversation"> | string
    createdAt?: DateTimeFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeFilter<"AiConversation"> | Date | string
    messages?: AiMessageListRelationFilter
  }, "id">

  export type AiConversationOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiConversationCountOrderByAggregateInput
    _max?: AiConversationMaxOrderByAggregateInput
    _min?: AiConversationMinOrderByAggregateInput
  }

  export type AiConversationScalarWhereWithAggregatesInput = {
    AND?: AiConversationScalarWhereWithAggregatesInput | AiConversationScalarWhereWithAggregatesInput[]
    OR?: AiConversationScalarWhereWithAggregatesInput[]
    NOT?: AiConversationScalarWhereWithAggregatesInput | AiConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiConversation"> | string
    guildId?: StringWithAggregatesFilter<"AiConversation"> | string
    channelId?: StringWithAggregatesFilter<"AiConversation"> | string
    userId?: StringWithAggregatesFilter<"AiConversation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiConversation"> | Date | string
  }

  export type AiMessageWhereInput = {
    AND?: AiMessageWhereInput | AiMessageWhereInput[]
    OR?: AiMessageWhereInput[]
    NOT?: AiMessageWhereInput | AiMessageWhereInput[]
    id?: StringFilter<"AiMessage"> | string
    conversationId?: StringFilter<"AiMessage"> | string
    role?: StringFilter<"AiMessage"> | string
    content?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
    conversation?: XOR<AiConversationRelationFilter, AiConversationWhereInput>
  }

  export type AiMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    conversation?: AiConversationOrderByWithRelationInput
  }

  export type AiMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiMessageWhereInput | AiMessageWhereInput[]
    OR?: AiMessageWhereInput[]
    NOT?: AiMessageWhereInput | AiMessageWhereInput[]
    conversationId?: StringFilter<"AiMessage"> | string
    role?: StringFilter<"AiMessage"> | string
    content?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
    conversation?: XOR<AiConversationRelationFilter, AiConversationWhereInput>
  }, "id">

  export type AiMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: AiMessageCountOrderByAggregateInput
    _max?: AiMessageMaxOrderByAggregateInput
    _min?: AiMessageMinOrderByAggregateInput
  }

  export type AiMessageScalarWhereWithAggregatesInput = {
    AND?: AiMessageScalarWhereWithAggregatesInput | AiMessageScalarWhereWithAggregatesInput[]
    OR?: AiMessageScalarWhereWithAggregatesInput[]
    NOT?: AiMessageScalarWhereWithAggregatesInput | AiMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiMessage"> | string
    conversationId?: StringWithAggregatesFilter<"AiMessage"> | string
    role?: StringWithAggregatesFilter<"AiMessage"> | string
    content?: StringWithAggregatesFilter<"AiMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiMessage"> | Date | string
  }

  export type UserLevelWhereInput = {
    AND?: UserLevelWhereInput | UserLevelWhereInput[]
    OR?: UserLevelWhereInput[]
    NOT?: UserLevelWhereInput | UserLevelWhereInput[]
    id?: StringFilter<"UserLevel"> | string
    guildId?: StringFilter<"UserLevel"> | string
    userId?: StringFilter<"UserLevel"> | string
    xp?: IntFilter<"UserLevel"> | number
    level?: IntFilter<"UserLevel"> | number
    lastXpAt?: DateTimeFilter<"UserLevel"> | Date | string
  }

  export type UserLevelOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    lastXpAt?: SortOrder
  }

  export type UserLevelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    guildId_userId?: UserLevelGuildIdUserIdCompoundUniqueInput
    AND?: UserLevelWhereInput | UserLevelWhereInput[]
    OR?: UserLevelWhereInput[]
    NOT?: UserLevelWhereInput | UserLevelWhereInput[]
    guildId?: StringFilter<"UserLevel"> | string
    userId?: StringFilter<"UserLevel"> | string
    xp?: IntFilter<"UserLevel"> | number
    level?: IntFilter<"UserLevel"> | number
    lastXpAt?: DateTimeFilter<"UserLevel"> | Date | string
  }, "id" | "guildId_userId">

  export type UserLevelOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    lastXpAt?: SortOrder
    _count?: UserLevelCountOrderByAggregateInput
    _avg?: UserLevelAvgOrderByAggregateInput
    _max?: UserLevelMaxOrderByAggregateInput
    _min?: UserLevelMinOrderByAggregateInput
    _sum?: UserLevelSumOrderByAggregateInput
  }

  export type UserLevelScalarWhereWithAggregatesInput = {
    AND?: UserLevelScalarWhereWithAggregatesInput | UserLevelScalarWhereWithAggregatesInput[]
    OR?: UserLevelScalarWhereWithAggregatesInput[]
    NOT?: UserLevelScalarWhereWithAggregatesInput | UserLevelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserLevel"> | string
    guildId?: StringWithAggregatesFilter<"UserLevel"> | string
    userId?: StringWithAggregatesFilter<"UserLevel"> | string
    xp?: IntWithAggregatesFilter<"UserLevel"> | number
    level?: IntWithAggregatesFilter<"UserLevel"> | number
    lastXpAt?: DateTimeWithAggregatesFilter<"UserLevel"> | Date | string
  }

  export type UserEconomyWhereInput = {
    AND?: UserEconomyWhereInput | UserEconomyWhereInput[]
    OR?: UserEconomyWhereInput[]
    NOT?: UserEconomyWhereInput | UserEconomyWhereInput[]
    id?: StringFilter<"UserEconomy"> | string
    guildId?: StringFilter<"UserEconomy"> | string
    userId?: StringFilter<"UserEconomy"> | string
    balance?: IntFilter<"UserEconomy"> | number
    lastDailyAt?: DateTimeNullableFilter<"UserEconomy"> | Date | string | null
  }

  export type UserEconomyOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    lastDailyAt?: SortOrderInput | SortOrder
  }

  export type UserEconomyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    guildId_userId?: UserEconomyGuildIdUserIdCompoundUniqueInput
    AND?: UserEconomyWhereInput | UserEconomyWhereInput[]
    OR?: UserEconomyWhereInput[]
    NOT?: UserEconomyWhereInput | UserEconomyWhereInput[]
    guildId?: StringFilter<"UserEconomy"> | string
    userId?: StringFilter<"UserEconomy"> | string
    balance?: IntFilter<"UserEconomy"> | number
    lastDailyAt?: DateTimeNullableFilter<"UserEconomy"> | Date | string | null
  }, "id" | "guildId_userId">

  export type UserEconomyOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    lastDailyAt?: SortOrderInput | SortOrder
    _count?: UserEconomyCountOrderByAggregateInput
    _avg?: UserEconomyAvgOrderByAggregateInput
    _max?: UserEconomyMaxOrderByAggregateInput
    _min?: UserEconomyMinOrderByAggregateInput
    _sum?: UserEconomySumOrderByAggregateInput
  }

  export type UserEconomyScalarWhereWithAggregatesInput = {
    AND?: UserEconomyScalarWhereWithAggregatesInput | UserEconomyScalarWhereWithAggregatesInput[]
    OR?: UserEconomyScalarWhereWithAggregatesInput[]
    NOT?: UserEconomyScalarWhereWithAggregatesInput | UserEconomyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserEconomy"> | string
    guildId?: StringWithAggregatesFilter<"UserEconomy"> | string
    userId?: StringWithAggregatesFilter<"UserEconomy"> | string
    balance?: IntWithAggregatesFilter<"UserEconomy"> | number
    lastDailyAt?: DateTimeNullableWithAggregatesFilter<"UserEconomy"> | Date | string | null
  }

  export type WarningWhereInput = {
    AND?: WarningWhereInput | WarningWhereInput[]
    OR?: WarningWhereInput[]
    NOT?: WarningWhereInput | WarningWhereInput[]
    id?: StringFilter<"Warning"> | string
    guildId?: StringFilter<"Warning"> | string
    userId?: StringFilter<"Warning"> | string
    moderatorId?: StringFilter<"Warning"> | string
    reason?: StringFilter<"Warning"> | string
    createdAt?: DateTimeFilter<"Warning"> | Date | string
  }

  export type WarningOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type WarningWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WarningWhereInput | WarningWhereInput[]
    OR?: WarningWhereInput[]
    NOT?: WarningWhereInput | WarningWhereInput[]
    guildId?: StringFilter<"Warning"> | string
    userId?: StringFilter<"Warning"> | string
    moderatorId?: StringFilter<"Warning"> | string
    reason?: StringFilter<"Warning"> | string
    createdAt?: DateTimeFilter<"Warning"> | Date | string
  }, "id">

  export type WarningOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    _count?: WarningCountOrderByAggregateInput
    _max?: WarningMaxOrderByAggregateInput
    _min?: WarningMinOrderByAggregateInput
  }

  export type WarningScalarWhereWithAggregatesInput = {
    AND?: WarningScalarWhereWithAggregatesInput | WarningScalarWhereWithAggregatesInput[]
    OR?: WarningScalarWhereWithAggregatesInput[]
    NOT?: WarningScalarWhereWithAggregatesInput | WarningScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Warning"> | string
    guildId?: StringWithAggregatesFilter<"Warning"> | string
    userId?: StringWithAggregatesFilter<"Warning"> | string
    moderatorId?: StringWithAggregatesFilter<"Warning"> | string
    reason?: StringWithAggregatesFilter<"Warning"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Warning"> | Date | string
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    guildId?: StringFilter<"Ticket"> | string
    channelId?: StringFilter<"Ticket"> | string
    userId?: StringFilter<"Ticket"> | string
    status?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    closedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    channelId?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    guildId?: StringFilter<"Ticket"> | string
    userId?: StringFilter<"Ticket"> | string
    status?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    closedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
  }, "id" | "channelId">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
    _count?: TicketCountOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    guildId?: StringWithAggregatesFilter<"Ticket"> | string
    channelId?: StringWithAggregatesFilter<"Ticket"> | string
    userId?: StringWithAggregatesFilter<"Ticket"> | string
    status?: StringWithAggregatesFilter<"Ticket"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    closedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
  }

  export type AfkStatusWhereInput = {
    AND?: AfkStatusWhereInput | AfkStatusWhereInput[]
    OR?: AfkStatusWhereInput[]
    NOT?: AfkStatusWhereInput | AfkStatusWhereInput[]
    id?: StringFilter<"AfkStatus"> | string
    guildId?: StringFilter<"AfkStatus"> | string
    userId?: StringFilter<"AfkStatus"> | string
    reason?: StringFilter<"AfkStatus"> | string
    createdAt?: DateTimeFilter<"AfkStatus"> | Date | string
  }

  export type AfkStatusOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type AfkStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    guildId_userId?: AfkStatusGuildIdUserIdCompoundUniqueInput
    AND?: AfkStatusWhereInput | AfkStatusWhereInput[]
    OR?: AfkStatusWhereInput[]
    NOT?: AfkStatusWhereInput | AfkStatusWhereInput[]
    guildId?: StringFilter<"AfkStatus"> | string
    userId?: StringFilter<"AfkStatus"> | string
    reason?: StringFilter<"AfkStatus"> | string
    createdAt?: DateTimeFilter<"AfkStatus"> | Date | string
  }, "id" | "guildId_userId">

  export type AfkStatusOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    _count?: AfkStatusCountOrderByAggregateInput
    _max?: AfkStatusMaxOrderByAggregateInput
    _min?: AfkStatusMinOrderByAggregateInput
  }

  export type AfkStatusScalarWhereWithAggregatesInput = {
    AND?: AfkStatusScalarWhereWithAggregatesInput | AfkStatusScalarWhereWithAggregatesInput[]
    OR?: AfkStatusScalarWhereWithAggregatesInput[]
    NOT?: AfkStatusScalarWhereWithAggregatesInput | AfkStatusScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AfkStatus"> | string
    guildId?: StringWithAggregatesFilter<"AfkStatus"> | string
    userId?: StringWithAggregatesFilter<"AfkStatus"> | string
    reason?: StringWithAggregatesFilter<"AfkStatus"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AfkStatus"> | Date | string
  }

  export type ReminderWhereInput = {
    AND?: ReminderWhereInput | ReminderWhereInput[]
    OR?: ReminderWhereInput[]
    NOT?: ReminderWhereInput | ReminderWhereInput[]
    id?: StringFilter<"Reminder"> | string
    guildId?: StringNullableFilter<"Reminder"> | string | null
    channelId?: StringFilter<"Reminder"> | string
    userId?: StringFilter<"Reminder"> | string
    message?: StringFilter<"Reminder"> | string
    remindAt?: DateTimeFilter<"Reminder"> | Date | string
    isCompleted?: BoolFilter<"Reminder"> | boolean
    createdAt?: DateTimeFilter<"Reminder"> | Date | string
  }

  export type ReminderOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrderInput | SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    remindAt?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
  }

  export type ReminderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReminderWhereInput | ReminderWhereInput[]
    OR?: ReminderWhereInput[]
    NOT?: ReminderWhereInput | ReminderWhereInput[]
    guildId?: StringNullableFilter<"Reminder"> | string | null
    channelId?: StringFilter<"Reminder"> | string
    userId?: StringFilter<"Reminder"> | string
    message?: StringFilter<"Reminder"> | string
    remindAt?: DateTimeFilter<"Reminder"> | Date | string
    isCompleted?: BoolFilter<"Reminder"> | boolean
    createdAt?: DateTimeFilter<"Reminder"> | Date | string
  }, "id">

  export type ReminderOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrderInput | SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    remindAt?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    _count?: ReminderCountOrderByAggregateInput
    _max?: ReminderMaxOrderByAggregateInput
    _min?: ReminderMinOrderByAggregateInput
  }

  export type ReminderScalarWhereWithAggregatesInput = {
    AND?: ReminderScalarWhereWithAggregatesInput | ReminderScalarWhereWithAggregatesInput[]
    OR?: ReminderScalarWhereWithAggregatesInput[]
    NOT?: ReminderScalarWhereWithAggregatesInput | ReminderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reminder"> | string
    guildId?: StringNullableWithAggregatesFilter<"Reminder"> | string | null
    channelId?: StringWithAggregatesFilter<"Reminder"> | string
    userId?: StringWithAggregatesFilter<"Reminder"> | string
    message?: StringWithAggregatesFilter<"Reminder"> | string
    remindAt?: DateTimeWithAggregatesFilter<"Reminder"> | Date | string
    isCompleted?: BoolWithAggregatesFilter<"Reminder"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Reminder"> | Date | string
  }

  export type PollWhereInput = {
    AND?: PollWhereInput | PollWhereInput[]
    OR?: PollWhereInput[]
    NOT?: PollWhereInput | PollWhereInput[]
    id?: StringFilter<"Poll"> | string
    messageId?: StringFilter<"Poll"> | string
    channelId?: StringFilter<"Poll"> | string
    guildId?: StringFilter<"Poll"> | string
    question?: StringFilter<"Poll"> | string
    options?: StringFilter<"Poll"> | string
    votes?: StringFilter<"Poll"> | string
    creatorId?: StringFilter<"Poll"> | string
    createdAt?: DateTimeFilter<"Poll"> | Date | string
  }

  export type PollOrderByWithRelationInput = {
    id?: SortOrder
    messageId?: SortOrder
    channelId?: SortOrder
    guildId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    votes?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
  }

  export type PollWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    messageId?: string
    AND?: PollWhereInput | PollWhereInput[]
    OR?: PollWhereInput[]
    NOT?: PollWhereInput | PollWhereInput[]
    channelId?: StringFilter<"Poll"> | string
    guildId?: StringFilter<"Poll"> | string
    question?: StringFilter<"Poll"> | string
    options?: StringFilter<"Poll"> | string
    votes?: StringFilter<"Poll"> | string
    creatorId?: StringFilter<"Poll"> | string
    createdAt?: DateTimeFilter<"Poll"> | Date | string
  }, "id" | "messageId">

  export type PollOrderByWithAggregationInput = {
    id?: SortOrder
    messageId?: SortOrder
    channelId?: SortOrder
    guildId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    votes?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    _count?: PollCountOrderByAggregateInput
    _max?: PollMaxOrderByAggregateInput
    _min?: PollMinOrderByAggregateInput
  }

  export type PollScalarWhereWithAggregatesInput = {
    AND?: PollScalarWhereWithAggregatesInput | PollScalarWhereWithAggregatesInput[]
    OR?: PollScalarWhereWithAggregatesInput[]
    NOT?: PollScalarWhereWithAggregatesInput | PollScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Poll"> | string
    messageId?: StringWithAggregatesFilter<"Poll"> | string
    channelId?: StringWithAggregatesFilter<"Poll"> | string
    guildId?: StringWithAggregatesFilter<"Poll"> | string
    question?: StringWithAggregatesFilter<"Poll"> | string
    options?: StringWithAggregatesFilter<"Poll"> | string
    votes?: StringWithAggregatesFilter<"Poll"> | string
    creatorId?: StringWithAggregatesFilter<"Poll"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Poll"> | Date | string
  }

  export type GuildConfigCreateInput = {
    guildId: string
    welcomeChannelId?: string | null
    welcomeMessage?: string | null
    autoRoleId?: string | null
    logChannelId?: string | null
    githubChannelId?: string | null
    aiChannelId?: string | null
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: number
    blockedWords?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildConfigUncheckedCreateInput = {
    guildId: string
    welcomeChannelId?: string | null
    welcomeMessage?: string | null
    autoRoleId?: string | null
    logChannelId?: string | null
    githubChannelId?: string | null
    aiChannelId?: string | null
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: number
    blockedWords?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildConfigUpdateInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    welcomeChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    welcomeMessage?: NullableStringFieldUpdateOperationsInput | string | null
    autoRoleId?: NullableStringFieldUpdateOperationsInput | string | null
    logChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    githubChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    aiChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    antiInvite?: BoolFieldUpdateOperationsInput | boolean
    antiLinks?: BoolFieldUpdateOperationsInput | boolean
    antiSpam?: BoolFieldUpdateOperationsInput | boolean
    maxMentions?: IntFieldUpdateOperationsInput | number
    blockedWords?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildConfigUncheckedUpdateInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    welcomeChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    welcomeMessage?: NullableStringFieldUpdateOperationsInput | string | null
    autoRoleId?: NullableStringFieldUpdateOperationsInput | string | null
    logChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    githubChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    aiChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    antiInvite?: BoolFieldUpdateOperationsInput | boolean
    antiLinks?: BoolFieldUpdateOperationsInput | boolean
    antiSpam?: BoolFieldUpdateOperationsInput | boolean
    maxMentions?: IntFieldUpdateOperationsInput | number
    blockedWords?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildConfigCreateManyInput = {
    guildId: string
    welcomeChannelId?: string | null
    welcomeMessage?: string | null
    autoRoleId?: string | null
    logChannelId?: string | null
    githubChannelId?: string | null
    aiChannelId?: string | null
    antiInvite?: boolean
    antiLinks?: boolean
    antiSpam?: boolean
    maxMentions?: number
    blockedWords?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildConfigUpdateManyMutationInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    welcomeChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    welcomeMessage?: NullableStringFieldUpdateOperationsInput | string | null
    autoRoleId?: NullableStringFieldUpdateOperationsInput | string | null
    logChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    githubChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    aiChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    antiInvite?: BoolFieldUpdateOperationsInput | boolean
    antiLinks?: BoolFieldUpdateOperationsInput | boolean
    antiSpam?: BoolFieldUpdateOperationsInput | boolean
    maxMentions?: IntFieldUpdateOperationsInput | number
    blockedWords?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildConfigUncheckedUpdateManyInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    welcomeChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    welcomeMessage?: NullableStringFieldUpdateOperationsInput | string | null
    autoRoleId?: NullableStringFieldUpdateOperationsInput | string | null
    logChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    githubChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    aiChannelId?: NullableStringFieldUpdateOperationsInput | string | null
    antiInvite?: BoolFieldUpdateOperationsInput | boolean
    antiLinks?: BoolFieldUpdateOperationsInput | boolean
    antiSpam?: BoolFieldUpdateOperationsInput | boolean
    maxMentions?: IntFieldUpdateOperationsInput | number
    blockedWords?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationCreateInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiMessageCreateNestedManyWithoutConversationInput
  }

  export type AiConversationUncheckedCreateInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type AiConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiMessageUpdateManyWithoutConversationNestedInput
  }

  export type AiConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type AiConversationCreateManyInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageCreateInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
    conversation: AiConversationCreateNestedOneWithoutMessagesInput
  }

  export type AiMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type AiMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: AiConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type AiMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageCreateManyInput = {
    id?: string
    conversationId: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type AiMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLevelCreateInput = {
    id?: string
    guildId: string
    userId: string
    xp?: number
    level?: number
    lastXpAt?: Date | string
  }

  export type UserLevelUncheckedCreateInput = {
    id?: string
    guildId: string
    userId: string
    xp?: number
    level?: number
    lastXpAt?: Date | string
  }

  export type UserLevelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    lastXpAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLevelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    lastXpAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLevelCreateManyInput = {
    id?: string
    guildId: string
    userId: string
    xp?: number
    level?: number
    lastXpAt?: Date | string
  }

  export type UserLevelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    lastXpAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLevelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    lastXpAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserEconomyCreateInput = {
    id?: string
    guildId: string
    userId: string
    balance?: number
    lastDailyAt?: Date | string | null
  }

  export type UserEconomyUncheckedCreateInput = {
    id?: string
    guildId: string
    userId: string
    balance?: number
    lastDailyAt?: Date | string | null
  }

  export type UserEconomyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    lastDailyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserEconomyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    lastDailyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserEconomyCreateManyInput = {
    id?: string
    guildId: string
    userId: string
    balance?: number
    lastDailyAt?: Date | string | null
  }

  export type UserEconomyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    lastDailyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserEconomyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    lastDailyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WarningCreateInput = {
    id?: string
    guildId: string
    userId: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUncheckedCreateInput = {
    id?: string
    guildId: string
    userId: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningCreateManyInput = {
    id?: string
    guildId: string
    userId: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    status?: string
    createdAt?: Date | string
    closedAt?: Date | string | null
  }

  export type TicketUncheckedCreateInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    status?: string
    createdAt?: Date | string
    closedAt?: Date | string | null
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketCreateManyInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    status?: string
    createdAt?: Date | string
    closedAt?: Date | string | null
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AfkStatusCreateInput = {
    id?: string
    guildId: string
    userId: string
    reason?: string
    createdAt?: Date | string
  }

  export type AfkStatusUncheckedCreateInput = {
    id?: string
    guildId: string
    userId: string
    reason?: string
    createdAt?: Date | string
  }

  export type AfkStatusUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AfkStatusUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AfkStatusCreateManyInput = {
    id?: string
    guildId: string
    userId: string
    reason?: string
    createdAt?: Date | string
  }

  export type AfkStatusUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AfkStatusUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderCreateInput = {
    id?: string
    guildId?: string | null
    channelId: string
    userId: string
    message: string
    remindAt: Date | string
    isCompleted?: boolean
    createdAt?: Date | string
  }

  export type ReminderUncheckedCreateInput = {
    id?: string
    guildId?: string | null
    channelId: string
    userId: string
    message: string
    remindAt: Date | string
    isCompleted?: boolean
    createdAt?: Date | string
  }

  export type ReminderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: NullableStringFieldUpdateOperationsInput | string | null
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    remindAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: NullableStringFieldUpdateOperationsInput | string | null
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    remindAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderCreateManyInput = {
    id?: string
    guildId?: string | null
    channelId: string
    userId: string
    message: string
    remindAt: Date | string
    isCompleted?: boolean
    createdAt?: Date | string
  }

  export type ReminderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: NullableStringFieldUpdateOperationsInput | string | null
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    remindAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: NullableStringFieldUpdateOperationsInput | string | null
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    remindAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PollCreateInput = {
    id?: string
    messageId: string
    channelId: string
    guildId: string
    question: string
    options: string
    votes?: string
    creatorId: string
    createdAt?: Date | string
  }

  export type PollUncheckedCreateInput = {
    id?: string
    messageId: string
    channelId: string
    guildId: string
    question: string
    options: string
    votes?: string
    creatorId: string
    createdAt?: Date | string
  }

  export type PollUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: StringFieldUpdateOperationsInput | string
    votes?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PollUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: StringFieldUpdateOperationsInput | string
    votes?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PollCreateManyInput = {
    id?: string
    messageId: string
    channelId: string
    guildId: string
    question: string
    options: string
    votes?: string
    creatorId: string
    createdAt?: Date | string
  }

  export type PollUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: StringFieldUpdateOperationsInput | string
    votes?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PollUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: StringFieldUpdateOperationsInput | string
    votes?: StringFieldUpdateOperationsInput | string
    creatorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GuildConfigCountOrderByAggregateInput = {
    guildId?: SortOrder
    welcomeChannelId?: SortOrder
    welcomeMessage?: SortOrder
    autoRoleId?: SortOrder
    logChannelId?: SortOrder
    githubChannelId?: SortOrder
    aiChannelId?: SortOrder
    antiInvite?: SortOrder
    antiLinks?: SortOrder
    antiSpam?: SortOrder
    maxMentions?: SortOrder
    blockedWords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildConfigAvgOrderByAggregateInput = {
    maxMentions?: SortOrder
  }

  export type GuildConfigMaxOrderByAggregateInput = {
    guildId?: SortOrder
    welcomeChannelId?: SortOrder
    welcomeMessage?: SortOrder
    autoRoleId?: SortOrder
    logChannelId?: SortOrder
    githubChannelId?: SortOrder
    aiChannelId?: SortOrder
    antiInvite?: SortOrder
    antiLinks?: SortOrder
    antiSpam?: SortOrder
    maxMentions?: SortOrder
    blockedWords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildConfigMinOrderByAggregateInput = {
    guildId?: SortOrder
    welcomeChannelId?: SortOrder
    welcomeMessage?: SortOrder
    autoRoleId?: SortOrder
    logChannelId?: SortOrder
    githubChannelId?: SortOrder
    aiChannelId?: SortOrder
    antiInvite?: SortOrder
    antiLinks?: SortOrder
    antiSpam?: SortOrder
    maxMentions?: SortOrder
    blockedWords?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildConfigSumOrderByAggregateInput = {
    maxMentions?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AiMessageListRelationFilter = {
    every?: AiMessageWhereInput
    some?: AiMessageWhereInput
    none?: AiMessageWhereInput
  }

  export type AiMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiConversationCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiConversationMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiConversationRelationFilter = {
    is?: AiConversationWhereInput
    isNot?: AiConversationWhereInput
  }

  export type AiMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLevelGuildIdUserIdCompoundUniqueInput = {
    guildId: string
    userId: string
  }

  export type UserLevelCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    lastXpAt?: SortOrder
  }

  export type UserLevelAvgOrderByAggregateInput = {
    xp?: SortOrder
    level?: SortOrder
  }

  export type UserLevelMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    lastXpAt?: SortOrder
  }

  export type UserLevelMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    lastXpAt?: SortOrder
  }

  export type UserLevelSumOrderByAggregateInput = {
    xp?: SortOrder
    level?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserEconomyGuildIdUserIdCompoundUniqueInput = {
    guildId: string
    userId: string
  }

  export type UserEconomyCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    lastDailyAt?: SortOrder
  }

  export type UserEconomyAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type UserEconomyMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    lastDailyAt?: SortOrder
  }

  export type UserEconomyMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    lastDailyAt?: SortOrder
  }

  export type UserEconomySumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type WarningCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type WarningMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type WarningMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    closedAt?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    closedAt?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    closedAt?: SortOrder
  }

  export type AfkStatusGuildIdUserIdCompoundUniqueInput = {
    guildId: string
    userId: string
  }

  export type AfkStatusCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type AfkStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type AfkStatusMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    userId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type ReminderCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    remindAt?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
  }

  export type ReminderMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    remindAt?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
  }

  export type ReminderMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    remindAt?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
  }

  export type PollCountOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    channelId?: SortOrder
    guildId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    votes?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
  }

  export type PollMaxOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    channelId?: SortOrder
    guildId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    votes?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
  }

  export type PollMinOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    channelId?: SortOrder
    guildId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    votes?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type AiMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput> | AiMessageCreateWithoutConversationInput[] | AiMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutConversationInput | AiMessageCreateOrConnectWithoutConversationInput[]
    createMany?: AiMessageCreateManyConversationInputEnvelope
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
  }

  export type AiMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput> | AiMessageCreateWithoutConversationInput[] | AiMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutConversationInput | AiMessageCreateOrConnectWithoutConversationInput[]
    createMany?: AiMessageCreateManyConversationInputEnvelope
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
  }

  export type AiMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput> | AiMessageCreateWithoutConversationInput[] | AiMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutConversationInput | AiMessageCreateOrConnectWithoutConversationInput[]
    upsert?: AiMessageUpsertWithWhereUniqueWithoutConversationInput | AiMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: AiMessageCreateManyConversationInputEnvelope
    set?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    disconnect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    delete?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    update?: AiMessageUpdateWithWhereUniqueWithoutConversationInput | AiMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: AiMessageUpdateManyWithWhereWithoutConversationInput | AiMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
  }

  export type AiMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput> | AiMessageCreateWithoutConversationInput[] | AiMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutConversationInput | AiMessageCreateOrConnectWithoutConversationInput[]
    upsert?: AiMessageUpsertWithWhereUniqueWithoutConversationInput | AiMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: AiMessageCreateManyConversationInputEnvelope
    set?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    disconnect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    delete?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    update?: AiMessageUpdateWithWhereUniqueWithoutConversationInput | AiMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: AiMessageUpdateManyWithWhereWithoutConversationInput | AiMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
  }

  export type AiConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiConversationCreateOrConnectWithoutMessagesInput
    connect?: AiConversationWhereUniqueInput
  }

  export type AiConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiConversationCreateOrConnectWithoutMessagesInput
    upsert?: AiConversationUpsertWithoutMessagesInput
    connect?: AiConversationWhereUniqueInput
    update?: XOR<XOR<AiConversationUpdateToOneWithWhereWithoutMessagesInput, AiConversationUpdateWithoutMessagesInput>, AiConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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
    in?: string[] | null
    notIn?: string[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AiMessageCreateWithoutConversationInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type AiMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type AiMessageCreateOrConnectWithoutConversationInput = {
    where: AiMessageWhereUniqueInput
    create: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput>
  }

  export type AiMessageCreateManyConversationInputEnvelope = {
    data: AiMessageCreateManyConversationInput | AiMessageCreateManyConversationInput[]
  }

  export type AiMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: AiMessageWhereUniqueInput
    update: XOR<AiMessageUpdateWithoutConversationInput, AiMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<AiMessageCreateWithoutConversationInput, AiMessageUncheckedCreateWithoutConversationInput>
  }

  export type AiMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: AiMessageWhereUniqueInput
    data: XOR<AiMessageUpdateWithoutConversationInput, AiMessageUncheckedUpdateWithoutConversationInput>
  }

  export type AiMessageUpdateManyWithWhereWithoutConversationInput = {
    where: AiMessageScalarWhereInput
    data: XOR<AiMessageUpdateManyMutationInput, AiMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type AiMessageScalarWhereInput = {
    AND?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
    OR?: AiMessageScalarWhereInput[]
    NOT?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
    id?: StringFilter<"AiMessage"> | string
    conversationId?: StringFilter<"AiMessage"> | string
    role?: StringFilter<"AiMessage"> | string
    content?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
  }

  export type AiConversationCreateWithoutMessagesInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    guildId: string
    channelId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiConversationCreateOrConnectWithoutMessagesInput = {
    where: AiConversationWhereUniqueInput
    create: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
  }

  export type AiConversationUpsertWithoutMessagesInput = {
    update: XOR<AiConversationUpdateWithoutMessagesInput, AiConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<AiConversationCreateWithoutMessagesInput, AiConversationUncheckedCreateWithoutMessagesInput>
    where?: AiConversationWhereInput
  }

  export type AiConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: AiConversationWhereInput
    data: XOR<AiConversationUpdateWithoutMessagesInput, AiConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type AiConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageCreateManyConversationInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type AiMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AiConversationCountOutputTypeDefaultArgs instead
     */
    export type AiConversationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiConversationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuildConfigDefaultArgs instead
     */
    export type GuildConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuildConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiConversationDefaultArgs instead
     */
    export type AiConversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiConversationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AiMessageDefaultArgs instead
     */
    export type AiMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AiMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserLevelDefaultArgs instead
     */
    export type UserLevelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserLevelDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserEconomyDefaultArgs instead
     */
    export type UserEconomyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserEconomyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WarningDefaultArgs instead
     */
    export type WarningArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WarningDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TicketDefaultArgs instead
     */
    export type TicketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TicketDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AfkStatusDefaultArgs instead
     */
    export type AfkStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AfkStatusDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReminderDefaultArgs instead
     */
    export type ReminderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReminderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PollDefaultArgs instead
     */
    export type PollArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PollDefaultArgs<ExtArgs>

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