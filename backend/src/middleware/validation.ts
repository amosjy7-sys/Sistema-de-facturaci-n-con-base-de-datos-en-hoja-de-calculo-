import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().forEach((err: any) => {
      extractedErrors.push({
        campo: err.param,
        mensaje: err.msg,
        valor: err.value,
      });
    });

    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      errores: extractedErrors,
    });
  };
};
