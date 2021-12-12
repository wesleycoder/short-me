/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/urls": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.urls.id"];
          url?: parameters["rowFilter.urls.url"];
          hash?: parameters["rowFilter.urls.hash"];
          access_count?: parameters["rowFilter.urls.access_count"];
          user_id?: parameters["rowFilter.urls.user_id"];
          created_at?: parameters["rowFilter.urls.created_at"];
          updated_at?: parameters["rowFilter.urls.updated_at"];
          public?: parameters["rowFilter.urls.public"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["urls"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** urls */
          urls?: definitions["urls"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.urls.id"];
          url?: parameters["rowFilter.urls.url"];
          hash?: parameters["rowFilter.urls.hash"];
          access_count?: parameters["rowFilter.urls.access_count"];
          user_id?: parameters["rowFilter.urls.user_id"];
          created_at?: parameters["rowFilter.urls.created_at"];
          updated_at?: parameters["rowFilter.urls.updated_at"];
          public?: parameters["rowFilter.urls.public"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.urls.id"];
          url?: parameters["rowFilter.urls.url"];
          hash?: parameters["rowFilter.urls.hash"];
          access_count?: parameters["rowFilter.urls.access_count"];
          user_id?: parameters["rowFilter.urls.user_id"];
          created_at?: parameters["rowFilter.urls.created_at"];
          updated_at?: parameters["rowFilter.urls.updated_at"];
          public?: parameters["rowFilter.urls.public"];
        };
        body: {
          /** urls */
          urls?: definitions["urls"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
}

export interface definitions {
  urls: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
    url: string;
    hash: string;
    access_count: number;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
    public: boolean;
  };
}

export interface parameters {
  /** Preference */
  preferParams: "params=single-object";
  /** Preference */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /** Preference */
  preferCount: "count=none";
  /** Filtering Columns */
  select: string;
  /** On Conflict */
  on_conflict: string;
  /** Ordering */
  order: string;
  /** Limiting and Pagination */
  range: string;
  /** Limiting and Pagination */
  rangeUnit: string;
  /** Limiting and Pagination */
  offset: string;
  /** Limiting and Pagination */
  limit: string;
  /** urls */
  "body.urls": definitions["urls"];
  "rowFilter.urls.id": string;
  "rowFilter.urls.url": string;
  "rowFilter.urls.hash": string;
  "rowFilter.urls.access_count": string;
  "rowFilter.urls.user_id": string;
  "rowFilter.urls.created_at": string;
  "rowFilter.urls.updated_at": string;
  "rowFilter.urls.public": string;
}

export interface operations {}

export interface external {}
