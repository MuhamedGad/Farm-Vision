import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';

import '../../../config/constants.dart';
import '../../../model/destination_model.dart';
import '../list_view_item/listview_itemcard.dart';

class DetailsScreen extends StatelessWidget {
  const DetailsScreen({Key? key, required this.des}) : super(key: key);
  final Destinitation des;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: MediaQuery.of(context).size.height * .5,
              decoration: BoxDecoration(
                  image: DecorationImage(
                image: AssetImage("assets/images/${des.image}"),
                fit: BoxFit.cover,
              )),
              child: Padding(
                padding: const EdgeInsets.only(left: 10, top: 35),
                child: Align(
                  alignment: Alignment.topLeft,
                  child: IconButton(
                    icon: const Icon(
                      Icons.navigate_before,
                      size: 30,
                      color: Colors.black,
                    ),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                  ),
                ),
              ),
            ),
            Container(
              height: MediaQuery.of(context).size.height * .5,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
              ),
              child: Padding(
                padding: const EdgeInsets.only(top: 30),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Divider(
                      height: 8,
                      color: deactiveColorIndicator,
                    ),
                    const SizedBox(
                      height: 30,
                    ),
                    const SizedBox(
                      height: 30,
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 12.0),
                      child: Text(
                        "About Plants",
                        style: TextStyle(fontSize: 25),
                      ),
                    ),
                    const SizedBox(
                      height: 15,
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 12.0),
                      child: Text(
                        "... Read More",
                        style: TextStyle(
                            fontSize: 15, color: descriptionTextColor),
                      ),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).pop();
                      },
                      child: Container(
                        alignment: Alignment.center,
                        margin: const EdgeInsets.only(
                            left: 30, right: 30, bottom: 40),
                        width: double.infinity,
                        height: 50,
                        decoration: BoxDecoration(
                          color: const Color(0XFF0D6EFD),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: const Text(
                          "Ok",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'switzer'),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ]),
    );
  }
}
