/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ModelLoginReq {
  login?: string;
  pass?: string;
}

export interface ModelLoginResp {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface ModelRegisterReq {
  login?: string;
  pass?: string;
}

export interface ModelRegisterResp {
  message?: string;
}

export interface ModelStar {
  age?: string;
  description?: string;
  distance?: string;
  id?: number;
  image_path?: string;
  is_deleted?: string;
  luminosity?: string;
  mass?: string;
  metallicity?: string;
  radius?: string;
  spectral_type?: string;
  temperature?: string;
  title?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title ExoCalc API
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl http://localhost:8080/api
 * @contact API Support <bitop@spatecon.ru> (https://vk.com/bmstu_schedule)
 *
 * API для работы с экзопланетами и звездами
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Аутентификация пользователя с получением JWT токена
     *
     * @tags Auth
     * @name LoginCreate
     * @summary Авторизация пользователя
     * @request POST:/auth/login
     */
    loginCreate: (input: ModelLoginReq, params: RequestParams = {}) =>
      this.request<ModelLoginResp, Record<string, any>>({
        path: `/auth/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершение сессии пользователя и инвалидация токена
     *
     * @tags Auth
     * @name LogoutCreate
     * @summary Деавторизация пользователя
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные авторизованного пользователя
     *
     * @tags Auth
     * @name GetAuth
     * @summary Получение информации о текущем пользователе
     * @request GET:/auth/me
     * @secure
     */
    getAuth: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание нового пользователя с ролью Client
     *
     * @tags Auth
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/auth/register
     */
    registerCreate: (input: ModelRegisterReq, params: RequestParams = {}) =>
      this.request<ModelRegisterResp, Record<string, any>>({
        path: `/auth/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание нового пользователя с ролью Astronomer
     *
     * @tags Auth
     * @name RegisterAstronomerCreate
     * @summary Регистрация астронома
     * @request POST:/auth/register-astronomer
     */
    registerAstronomerCreate: (
      input: ModelRegisterReq,
      params: RequestParams = {},
    ) =>
      this.request<ModelRegisterResp, Record<string, any>>({
        path: `/auth/register-astronomer`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  calculateExoplanets = {
    /**
     * @description Удаляет звезду из текущей заявки
     *
     * @tags CalculateExoplanets
     * @name RemoveStarDelete
     * @summary Удаление звезды из заявки
     * @request DELETE:/calculate-exoplanets/remove-star/{id}
     * @secure
     */
    removeStarDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/calculate-exoplanets/remove-star/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Обновляет комментарий для конкретной звезды в заявке
     *
     * @tags CalculateExoplanets
     * @name UpdateStarCommentUpdate
     * @summary Обновление комментария для расчетов экзопланет
     * @request PUT:/calculate-exoplanets/updateStarComment
     * @secure
     */
    updateStarCommentUpdate: (
      query: {
        /** ID заявки */
        selected_stars_id: number;
        /** ID звезды */
        star_id: number;
      },
      input: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, any>>({
        path: `/calculate-exoplanets/updateStarComment`,
        method: "PUT",
        query: query,
        body: input,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  selectedStars = {
    /**
     * @description Возвращает отфильтрованный список заявок
     *
     * @tags SelectedStars
     * @name SelectedStarsList
     * @summary Получение списка заявок
     * @request GET:/selected-stars
     * @secure
     */
    selectedStarsList: (
      query?: {
        /** Дата начала (YYYY-MM-DD) */
        date_from?: string;
        /** Дата окончания (YYYY-MM-DD) */
        date_to?: string;
        /** Статус заявки (draft, formed, completed, declined) */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую черновую заявку
     *
     * @tags SelectedStars
     * @name SelectedStarsCreate
     * @summary Создание черновика заявки
     * @request POST:/selected-stars
     * @secure
     */
    selectedStarsCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет звезду по ID в текущую заявку
     *
     * @tags SelectedStars
     * @name AddStarCreate
     * @summary Добавление звезды в заявку
     * @request POST:/selected-stars/add-star/{id}
     * @secure
     */
    addStarCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/selected-stars/add-star/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Возвращает ID текущей черновой заявки и количество звезд в ней
     *
     * @tags SelectedStars
     * @name CountList
     * @summary Получение количества звезд в текущей заявке
     * @request GET:/selected-stars/count
     * @secure
     */
    countList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars/count`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает заявку со всеми расчетами экзопланет
     *
     * @tags SelectedStars
     * @name SelectedStarsDetail
     * @summary Получение заявки по ID
     * @request GET:/selected-stars/{id}
     * @secure
     */
    selectedStarsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет дату и ученого для заявки
     *
     * @tags SelectedStars
     * @name SelectedStarsUpdate
     * @summary Обновление заявки
     * @request PUT:/selected-stars/{id}
     * @secure
     */
    selectedStarsUpdate: (
      id: number,
      input: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет заявку по ID
     *
     * @tags SelectedStars
     * @name SelectedStarsDelete
     * @summary Удаление заявки
     * @request DELETE:/selected-stars/{id}
     * @secure
     */
    selectedStarsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/selected-stars/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Переводит заявку из черновика в статус "formed"
     *
     * @tags SelectedStars
     * @name FormUpdate
     * @summary Формирование заявки
     * @request PUT:/selected-stars/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars/${id}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Модератор подтверждает или отклоняет заявку (требуется роль Astronomer)
     *
     * @tags SelectedStars
     * @name ModerateUpdate
     * @summary Модерация заявки
     * @request PUT:/selected-stars/{id}/moderate
     * @secure
     */
    moderateUpdate: (
      id: number,
      input: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/selected-stars/${id}/moderate`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  stars = {
    /**
     * @description Возвращает список всех звезд или отфильтрованный по названию
     *
     * @tags Stars
     * @name StarsList
     * @summary Получение списка звезд
     * @request GET:/stars
     */
    starsList: (
      query?: {
        /** Поиск по названию звезды */
        searchedStar?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stars`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую звезду (требуется роль Astronomer)
     *
     * @tags Stars
     * @name StarsCreate
     * @summary Создание новой звезды
     * @request POST:/stars
     * @secure
     */
    starsCreate: (input: ModelStar, params: RequestParams = {}) =>
      this.request<ModelStar, Record<string, any>>({
        path: `/stars`,
        method: "POST",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные звезды по указанному ID
     *
     * @tags Stars
     * @name StarsDetail
     * @summary Получение звезды по ID
     * @request GET:/stars/{id}
     */
    starsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stars/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные существующей звезды (требуется роль Astronomer)
     *
     * @tags Stars
     * @name StarsUpdate
     * @summary Обновление звезды
     * @request PUT:/stars/{id}
     * @secure
     */
    starsUpdate: (id: number, input: ModelStar, params: RequestParams = {}) =>
      this.request<ModelStar, Record<string, any>>({
        path: `/stars/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет звезду по ID (требуется роль Astronomer)
     *
     * @tags Stars
     * @name StarsDelete
     * @summary Удаление звезды
     * @request DELETE:/stars/{id}
     * @secure
     */
    starsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stars/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для звезды (требуется роль Astronomer)
     *
     * @tags Stars
     * @name ImageCreate
     * @summary Загрузка изображения звезды
     * @request POST:/stars/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/stars/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
}
