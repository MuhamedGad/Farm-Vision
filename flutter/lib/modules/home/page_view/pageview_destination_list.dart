import 'package:flutter/material.dart';
import '../../../model/destination_model.dart';
import '../list_view_item/destination_card.dart';

class PageViewDestinationList extends StatefulWidget {
  const PageViewDestinationList({Key? key}) : super(key: key);

  @override
  State<PageViewDestinationList> createState() =>
      _PageViewDestinationListState();
}

class _PageViewDestinationListState extends State<PageViewDestinationList> {
  final PageController pageController = PageController(viewportFraction: 0.90);
  int curettage = 0;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushNamed('/listviewitem');
      },
      child: SizedBox(
        height: 420,
        child: PageView.builder(
          padEnds: false,
          controller: pageController,
          itemCount: destination.length,
          physics: const BouncingScrollPhysics(),
          itemBuilder: (context, index) {
            bool active = index == curettage;
            return Opacity(
              opacity: curettage == index ? 1.0 : 0.5,
              child: DestinationCard(
                active: active,
                index: index,
                destinitation: destination[index],
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();

    pageController.addListener(() {
      int position = pageController.page!.round();
      if (curettage != position) {
        setState(() {
          curettage = position;
        });
      }
    });
  }
}
