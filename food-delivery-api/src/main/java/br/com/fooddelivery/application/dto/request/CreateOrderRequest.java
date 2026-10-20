package br.com.fooddelivery.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Address is required")
    @Valid
    private AddressRequest address;

    @NotEmpty(message = "Items are required")
    @Valid
    private List<OrderItemRequest> items;
}
