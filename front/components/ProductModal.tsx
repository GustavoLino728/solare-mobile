import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function ProductModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {product.name}
            </ModalHeader>
            <ModalBody>
              <img src={product.img} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
              <p><strong>Preço:</strong> R${parseFloat(product.price).toFixed(2)}</p>
              <p><strong>Descrição:</strong> {product.description || "-"}</p>
              <p><strong>Tamanho:</strong> {product.size || "-"}</p>
              <p><strong>Cor:</strong> {product.color || "-"}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
              <Button color="primary">
                Comprar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
