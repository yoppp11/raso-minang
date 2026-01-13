const { errorHandler } = require('../../middlewares/errorMiddleware');

describe('Error Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  it('should handle Unauthorized error', () => {
    const error = { name: 'Unauthorized', message: 'Invalid token' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Invalid token'
    });
  });

  it('should handle Forbidden error', () => {
    const error = { name: 'Forbidden', message: 'Access denied' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Access denied'
    });
  });

  it('should handle NotFound error', () => {
    const error = { name: 'NotFound', message: 'Resource not found' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Resource not found'
    });
  });

  it('should handle BadRequest error', () => {
    const error = { name: 'BadRequest', message: 'Invalid request' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Invalid request'
    });
  });

  it('should handle SequelizeValidationError', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Validation failed' }]
    };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should handle SequelizeUniqueConstraintError', () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Unique constraint violation' }]
    };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should handle JsonWebTokenError', () => {
    const error = { name: 'JsonWebTokenError' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Invalid token'
    });
  });

  it('should handle unknown errors with 500 status', () => {
    const error = { name: 'UnknownError', message: 'Something went wrong' };
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Internal server error'
    });
  });

  it('should handle errors without name property', () => {
    const error = new Error('Generic error');
    
    errorHandler(error, mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
