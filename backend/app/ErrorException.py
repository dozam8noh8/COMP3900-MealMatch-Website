from flask import jsonify

class ErrorException(Exception):
    statusCode = 500
    status = "failure"

    def __init__(self, message, statusCode=500, status='failure'):
        Exception.__init__(self)
        self.message = message
        self.statusCode = statusCode
        self.status = status

    def to_dict(self):
        error = dict()
        error['message'] = self.message
        error['statusCode'] = self.statusCode
        error['status'] = self.status
        return error