package br.com.fooddelivery;

import br.com.fooddelivery.domain.model.Order;
import br.com.fooddelivery.domain.model.OrderStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderStatusTransitionTest {

    @Test
    void validTransition_RecebidoToEmPreparo_ShouldSucceed() {
        Order order = new Order();
        order.setStatus(OrderStatus.RECEBIDO);

        order.updateStatus(OrderStatus.EM_PREPARO);

        assertEquals(OrderStatus.EM_PREPARO, order.getStatus());
    }

    @Test
    void validTransition_EmPreparoToSaiuParaEntrega_ShouldSucceed() {
        Order order = new Order();
        order.setStatus(OrderStatus.EM_PREPARO);

        order.updateStatus(OrderStatus.SAIU_PARA_ENTREGA);

        assertEquals(OrderStatus.SAIU_PARA_ENTREGA, order.getStatus());
    }

    @Test
    void validTransition_SaiuParaEntregaToEntregue_ShouldSucceed() {
        Order order = new Order();
        order.setStatus(OrderStatus.SAIU_PARA_ENTREGA);

        order.updateStatus(OrderStatus.ENTREGUE);

        assertEquals(OrderStatus.ENTREGUE, order.getStatus());
    }

    @Test
    void validTransition_RecebidoToCancelado_ShouldSucceed() {
        Order order = new Order();
        order.setStatus(OrderStatus.RECEBIDO);

        order.updateStatus(OrderStatus.CANCELADO);

        assertEquals(OrderStatus.CANCELADO, order.getStatus());
    }

    @Test
    void validTransition_EmPreparoToCancelado_ShouldSucceed() {
        Order order = new Order();
        order.setStatus(OrderStatus.EM_PREPARO);

        order.updateStatus(OrderStatus.CANCELADO);

        assertEquals(OrderStatus.CANCELADO, order.getStatus());
    }

    @Test
    void invalidTransition_EntregueToRecebido_ShouldFail() {
        Order order = new Order();
        order.setStatus(OrderStatus.ENTREGUE);

        assertThrows(IllegalArgumentException.class, () -> order.updateStatus(OrderStatus.RECEBIDO));
    }

    @Test
    void invalidTransition_CanceladoToRecebido_ShouldFail() {
        Order order = new Order();
        order.setStatus(OrderStatus.CANCELADO);

        assertThrows(IllegalArgumentException.class, () -> order.updateStatus(OrderStatus.RECEBIDO));
    }

    @Test
    void invalidTransition_SaiuParaEntregaToRecebido_ShouldFail() {
        Order order = new Order();
        order.setStatus(OrderStatus.SAIU_PARA_ENTREGA);

        assertThrows(IllegalArgumentException.class, () -> order.updateStatus(OrderStatus.RECEBIDO));
    }

    @Test
    void invalidTransition_EntregueToEmPreparo_ShouldFail() {
        Order order = new Order();
        order.setStatus(OrderStatus.ENTREGUE);

        assertThrows(IllegalArgumentException.class, () -> order.updateStatus(OrderStatus.EM_PREPARO));
    }
}
