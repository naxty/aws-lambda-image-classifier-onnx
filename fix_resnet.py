import torch
import torchvision.models as models
from torch.utils.model_zoo import load_url as load_state_dict_from_url
import torch.nn.functional as f

# https://github.com/Microsoft/onnxjs/issues/84
class FixResNet50(models.resnet.ResNet):
    def __init__(self, block, layers, num_classes=1000, zero_init_residual=False, groups=1, width_per_group=64,
                 replace_stride_with_dilation=None, norm_layer=None):
        super().__init__(block, layers, num_classes, zero_init_residual,)

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)

        x = self.avgpool(x)
        x = x.view(-1)
        x = x.unsqueeze(0)
        x = self.fc(x)
        x = f.softmax(x, dim=1)
        return x

model_url = 'https://download.pytorch.org/models/resnet50-19c8e357.pth'

model = FixResNet50(models.resnet.Bottleneck, [3, 4, 6, 3])
state_dict = load_state_dict_from_url(model_url,
                                     progress=True)
model.load_state_dict(state_dict)

from torch.autograd import Variable
dummy_input = Variable(torch.randn(1, 3, 224, 224))
torch.onnx.export(model, dummy_input, "./model/resnet.onnx")