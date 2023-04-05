import 'package:flutter/material.dart';
import 'package:smartfarm/modules/intro/slider_screen/first_page_slider.dart';
import 'package:smartfarm/modules/intro/slider_screen/second_page_slider.dart';
import 'package:smartfarm/modules/intro/slider_screen/third_page_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../constant/constants.dart';

class IntroPage extends StatelessWidget {
  IntroPage({Key? key}) : super(key: key);
  final controllerPageSlider = PageController();
  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size.width * .35;
    return Stack(children: [
      PageView(
        controller: controllerPageSlider,
        children: [
          FirstPageSlider(
            controllerPageSlider: controllerPageSlider,
          ),
          SecondPageSlider(
            controllerPageSlider: controllerPageSlider,
          ),
          ThirdPageSlider(
            controllerPageSlider: controllerPageSlider,
          )
        ],
      ),
      Positioned(
          bottom: 77,
          left: size,
          child: SmoothPageIndicator(
            controller: controllerPageSlider,
            count: 3,
            effect: const ExpandingDotsEffect(
                activeDotColor: activeColorIndicator,
                dotColor: deactivateColorIndicator),
          )),
    ]);
  }
}
