# nifty-types
Nifty Types for TypeScript

interface IRequest {
    id: string
}
interface IResponse {
    name: string
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type None = void
type Extends<T, TT, Get, Else> = T extends TT ? Get : Else;
type ExtendsOrNone<T, TT, Get> = Extends<T, TT, Get, None>
type ElseIfNone<T, Else> = T extends None ? Else : T;

// Either without "ther"
type Ei2<T1, T2>                        = ElseIfNone<T1, T2>;
type Ei3<T1, T2, T3>                    = ElseIfNone<T1, Ei2<T2, T3>>;
type Ei4<T1, T2, T3, T4>                = ElseIfNone<T1, Ei3<T2, T3, T4>>;
type Ei<T1, T2, T3 = None, T4 = None>   = Ei4<T1, T2, T3, T4>;

type GET<M extends Method, L>           = ExtendsOrNone<M, 'GET', L>
type POST<M extends Method, L>          = ExtendsOrNone<M, 'POST', L>
type PUT<M extends Method, L>           = ExtendsOrNone<M, 'PUT', L>
type DELETE<M extends Method, L>        = ExtendsOrNone<M, 'DELETE', L>

type Payload<M extends Method, U extends string> =
    Ei<
        GET<M, ExtendsOrNone<U, 'api/v1/test', IRequest>>,
        GET<M, ExtendsOrNone<U, 'get:api/v1/test', IRequest>>,
        PUT<M, ExtendsOrNone<U, 'api/v1/test', IRequest>>,
        DELETE<M, ExtendsOrNone<U, 'api/v1/test', IRequest>>
    >

type Res<M extends Method, U> =
    U extends 'api/v1/test' ? IResponse : M;

function tfetch<M extends Method, U extends string>(r: Payload<M, U>): Promise<Res<M, U>> {
    return fetch('asd').then(res => res.json()) as Promise<Res<M, U>>;
}

let r = tfetch<'PUT', 'api/v1/test'>({ id: 'test' });
