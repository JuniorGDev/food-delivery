package br.com.fooddelivery;

import br.com.fooddelivery.application.dto.request.AddressRequest;
import br.com.fooddelivery.application.dto.request.CreateOrderRequest;
import br.com.fooddelivery.application.dto.request.OrderItemRequest;
import br.com.fooddelivery.application.dto.request.UpdateStatusRequest;
import br.com.fooddelivery.application.dto.response.OrderResponse;
import br.com.fooddelivery.application.service.OrderService;
import br.com.fooddelivery.domain.model.*;
import br.com.fooddelivery.domain.repository.OrderRepository;
import br.com.fooddelivery.domain.repository.UserRepository;
import br.com.fooddelivery.infrastructure.exception.EmptyOrderItemsException;
import br.com.fooddelivery.infrastructure.exception.InvalidOrderStatusException;
import br.com.fooddelivery.infrastructure.exception.OrderNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Address address;
    private OrderItem item;
    private Order order;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User(1L, "John Doe", "john@example.com", "hashedPassword", null);
        address = new Address(1L, "Street", "123", "Apt", "Neighborhood", "City", "State", "12345");
        item = new OrderItem(1L, "Product", 2, 10.0, null);
        order = new Order(1L, user, Arrays.asList(item), address, OrderStatus.RECEBIDO, null);
        item.setOrder(order);
    }

    @Test
    void createOrder_ShouldReturnOrderResponse_WhenValidRequest() {
        AddressRequest addressRequest = new AddressRequest("Street", "123", "Apt", "Neighborhood", "City", "State", "12345");
        OrderItemRequest itemRequest = new OrderItemRequest("Product", 2, 10.0);
        CreateOrderRequest request = new CreateOrderRequest(addressRequest, Arrays.asList(itemRequest));

        when(userRepository.findById(any())).thenReturn(Optional.of(user));
        when(orderRepository.save(any())).thenReturn(order);

        OrderResponse response = orderService.createOrder(request, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John Doe", response.getCustomerName());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_ShouldThrowException_WhenUserNotFound() {
        AddressRequest addressRequest = new AddressRequest("Street", "123", "Apt", "Neighborhood", "City", "State", "12345");
        OrderItemRequest itemRequest = new OrderItemRequest("Product", 2, 10.0);
        CreateOrderRequest request = new CreateOrderRequest(addressRequest, Arrays.asList(itemRequest));

        when(userRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> orderService.createOrder(request, 1L));
    }

    @Test
    void listAllOrders_ShouldReturnAllOrders() {
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order));

        List<OrderResponse> responses = orderService.listAllOrders();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());
    }

    @Test
    void getOrderById_ShouldReturnOrder_WhenExists() {
        when(orderRepository.findById(any())).thenReturn(Optional.of(order));

        OrderResponse response = orderService.getOrderById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void getOrderById_ShouldThrowException_WhenNotExists() {
        when(orderRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.getOrderById(1L));
    }

    @Test
    void updateOrderStatus_ShouldUpdateStatus_WhenValidTransition() {
        UpdateStatusRequest request = new UpdateStatusRequest(OrderStatus.EM_PREPARO);
        when(orderRepository.findById(any())).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        OrderResponse response = orderService.updateOrderStatus(1L, request);

        assertNotNull(response);
        assertEquals(OrderStatus.EM_PREPARO, response.getStatus());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void updateOrderStatus_ShouldThrowException_WhenInvalidTransition() {
        UpdateStatusRequest request = new UpdateStatusRequest(OrderStatus.RECEBIDO);
        order.setStatus(OrderStatus.ENTREGUE);
        when(orderRepository.findById(any())).thenReturn(Optional.of(order));

        assertThrows(InvalidOrderStatusException.class, () -> orderService.updateOrderStatus(1L, request));
    }

    @Test
    void createOrder_ShouldThrowException_WhenEmptyItems() {
        AddressRequest addressRequest = new AddressRequest("Street", "123", "Apt", "Neighborhood", "City", "State", "12345");
        CreateOrderRequest request = new CreateOrderRequest(addressRequest, Arrays.asList());

        when(userRepository.findById(any())).thenReturn(Optional.of(user));

        assertThrows(EmptyOrderItemsException.class, () -> orderService.createOrder(request, 1L));
    }
}
