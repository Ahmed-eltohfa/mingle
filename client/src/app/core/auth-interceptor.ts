import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOGM3ZTlkNzdlNjIwMDVkOTRhM2ZhZSIsImlhdCI6MTc4NzcwMDYzMSwiZXhwIjoxNzg3Nzg3MDMxfQ.JpDEwdjY5cJASIenvWvCChq0qPnWesdVjNOE8o-XKYk"; // or wherever you store it

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};