import { Response } from 'express';

interface ResponseData<T = any> {
  status: number;
  message: string;
  data?: T;
  pagination?: Pagination;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const wrapper = {
  response: <T = any>(
    res: Response,
    status: number,
    message: string,
    data?: T,
    pagination?: Omit<Pagination, 'totalPages'> // totalPages can be calculated
  ) => {
    let finalPagination: Pagination | undefined;

    if (pagination) {
      finalPagination = {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.pageSize),
      };
    }

    const responseData: ResponseData<T> = {
      status,
      message,
      data,
      pagination: finalPagination,
    };

    return res.status(status).json(responseData);
  },
};

export default wrapper;
