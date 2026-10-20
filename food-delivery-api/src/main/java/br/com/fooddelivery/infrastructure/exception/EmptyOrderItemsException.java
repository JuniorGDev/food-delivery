package br.com.fooddelivery.infrastructure.exception;

public class EmptyOrderItemsException extends RuntimeException {
    public EmptyOrderItemsException(String message) {
        super(message);
    }
}
