package br.com.fooddelivery.application.dto.response;

import br.com.fooddelivery.domain.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private List<OrderItemResponse> items;
    private AddressResponse address;
    private OrderStatus status;
    private LocalDateTime createdAt;
}
