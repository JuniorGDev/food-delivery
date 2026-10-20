package br.com.fooddelivery.application.service;

import br.com.fooddelivery.application.dto.request.AddressRequest;
import br.com.fooddelivery.application.dto.request.CreateOrderRequest;
import br.com.fooddelivery.application.dto.request.OrderItemRequest;
import br.com.fooddelivery.application.dto.request.UpdateStatusRequest;
import br.com.fooddelivery.application.dto.response.AddressResponse;
import br.com.fooddelivery.application.dto.response.OrderItemResponse;
import br.com.fooddelivery.application.dto.response.OrderResponse;
import br.com.fooddelivery.domain.model.*;
import br.com.fooddelivery.domain.repository.OrderRepository;
import br.com.fooddelivery.domain.repository.UserRepository;
import br.com.fooddelivery.infrastructure.exception.EmptyOrderItemsException;
import br.com.fooddelivery.infrastructure.exception.InvalidOrderStatusException;
import br.com.fooddelivery.infrastructure.exception.OrderNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Long userId) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new EmptyOrderItemsException("O pedido deve possuir pelo menos um item");
        }

        Address address = convertToAddress(request.getAddress());
        List<OrderItem> items = request.getItems().stream()
                .map(this::convertToOrderItem)
                .collect(Collectors.toList());

        Order order = new Order();
        order.setCustomer(customer);
        order.setAddress(address);
        order.setItems(items);
        order.setStatus(OrderStatus.RECEBIDO);

        items.forEach(item -> item.setOrder(order));

        Order savedOrder = orderRepository.save(order);
        return convertToOrderResponse(savedOrder);
    }

    public List<OrderResponse> listAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Pedido não encontrado"));
        return convertToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Pedido não encontrado"));

        try {
            order.updateStatus(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new InvalidOrderStatusException(e.getMessage());
        }

        Order savedOrder = orderRepository.save(order);
        return convertToOrderResponse(savedOrder);
    }

    private Address convertToAddress(AddressRequest request) {
        return new Address(
                null,
                request.getStreet(),
                request.getNumber(),
                request.getComplement(),
                request.getNeighborhood(),
                request.getCity(),
                request.getState(),
                request.getZipCode()
        );
    }

    private OrderItem convertToOrderItem(OrderItemRequest request) {
        return new OrderItem(
                null,
                request.getProduct(),
                request.getQuantity(),
                request.getPrice(),
                null
        );
    }

    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProduct(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());

        AddressResponse addressResponse = new AddressResponse(
                order.getAddress().getId(),
                order.getAddress().getStreet(),
                order.getAddress().getNumber(),
                order.getAddress().getComplement(),
                order.getAddress().getNeighborhood(),
                order.getAddress().getCity(),
                order.getAddress().getState(),
                order.getAddress().getZipCode()
        );

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                itemResponses,
                addressResponse,
                order.getStatus(),
                order.getCreatedAt()
        );
    }
}
